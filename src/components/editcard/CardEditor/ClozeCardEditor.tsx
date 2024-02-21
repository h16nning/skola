import { useHotkeys } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconBracketsContain } from "@tabler/icons-react";
import { EditMode } from "../../../logic/CardTypeManager";
import { Card, CardType, newCards } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import CardEditor, { useCardEditor } from "./CardEditor";
import classes from "./ClozeCardEditor.module.css";

import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClozeCardUtils,
  createClozeCardSet,
} from "../../../logic/CardTypeImplementations/ClozeCard";
import {
  getCardsReferencingSharedValue,
  getSharedValue,
  useSharedValue,
} from "../../../logic/sharedvalue";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import CardEditorFooter from "../CardEditorFooter";

interface ClozeCardEditorProps {
  card: Card<CardType.Cloze> | null;
  deck: Deck;
  mode: EditMode;
}

export default function ClozeCardEditor({
  card,
  deck,
  mode,
}: ClozeCardEditorProps) {
  const [requestedFinish, setRequestedFinish] = useState(false);

  useHotkeys([["mod+Enter", () => setRequestedFinish(true)]]);

  //fix sometime
  const editor = useCardEditor({
    content: useSharedValue(card?.content.textReferenceId ?? "")?.value ?? "",
    onUpdate: ({ editor }) => {
      if (editor?.getHTML().valueOf() !== editorContent.valueOf()) {
        setEditorContent(editor?.getHTML() ?? "");
      }
    },
    finish: () => {
      setRequestedFinish(true);
    },
  });

  const [editorContent, setEditorContent] = useState<string>(
    editor?.getHTML() ?? ""
  );

  const smallestAvailableOcclusionNumber = useMemo(() => {
    const occlusionNumberSet = getOcclusionNumberSet(editorContent);
    for (let i = 1; i < 10; i++) {
      if (!occlusionNumberSet.includes(i)) {
        return i;
      }
    }
    return 9;
  }, [editorContent]);

  const clear = useCallback(() => {
    editor?.commands.setContent("");
    editor?.commands.focus();
  }, [editor]);

  useEffect(() => {
    if (requestedFinish) {
      finish(mode, clear, deck, card, editorContent);
      setRequestedFinish(false);
    }
  }, [requestedFinish, mode, clear, deck, card, editorContent]);

  return (
    <Stack gap="2rem">
      <CardEditor
        editor={editor}
        className={classes}
        controls={
          <RichTextEditor.Control
            tabIndex={-1}
            onClick={() => {
              if (editor?.state.selection.from !== editor?.state.selection.to) {
                const occludedText = `{{c${smallestAvailableOcclusionNumber}::${window.getSelection()}}}`;
                editor?.commands.insertContent(occludedText);
              } else {
                editor?.commands.insertContent(
                  `{{c${smallestAvailableOcclusionNumber}::}}`
                );
                editor?.commands.setTextSelection(
                  editor?.state.selection.to - 2
                );
              }
            }}
          >
            <IconBracketsContain />
          </RichTextEditor.Control>
        }
      />
      <CardEditorFooter finish={() => setRequestedFinish(true)} mode={mode} />
    </Stack>
  );
}

async function finish(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  card: Card<CardType.Cloze> | null,
  editorContent: string
) {
  if (mode === "edit") {
    //ISSUE newly introduced cards through edit are not recognized
    try {
      if (card) {
        ClozeCardUtils.update(
          {
            text: editorContent,
          },
          card
        );
        const cardsReferencingSameSharedValue = await getSharedValue(
          card.content.textReferenceId
        ).then((sv) => sv && getCardsReferencingSharedValue(sv));
        cardsReferencingSameSharedValue !== undefined &&
          (await Promise.all(
            cardsReferencingSameSharedValue.map(
              (card) =>
                card !== undefined &&
                ClozeCardUtils.update(
                  {
                    text: editorContent,
                  },
                  card as Card<CardType.Cloze>
                )
            )
          ));
      }
      successfullySaved();
    } catch {
      saveFailed();
    }
  } else {
    const occlusionNumberSet: number[] = getOcclusionNumberSet(editorContent);
    try {
      createClozeCardSet({
        text: editorContent,
        occlusionNumberSet,
      }).then((cards) => newCards(cards, deck));
      clear();
      successfullyAdded();
    } catch {
      addFailed();
    }
  }
}

function getOcclusionNumberSet(text: string) {
  const regex = /\{\{c(\d+)::((?!\{\{|}}).)*\}\}/g;
  const matches = text.match(regex);
  const cardNumbers = new Set<number>();
  matches?.forEach((match) => {
    const numberMatch = match.match(/c(\d+)::/);
    if (numberMatch && numberMatch[1]) {
      const number = parseInt(numberMatch[1]);
      cardNumbers.add(number);
    }
  });
  return Array.from(cardNumbers);
}

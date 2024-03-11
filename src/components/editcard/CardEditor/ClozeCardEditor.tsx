import { useHotkeys } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconBracketsContain } from "@tabler/icons-react";
import { EditMode } from "../../../logic/TypeManager";
import { CardType } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import classes from "./ClozeCardEditor.module.css";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

import { Stack } from "@mantine/core";
import { Editor } from "@tiptap/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClozeCardUtils } from "../../../logic/CardTypeImplementations/ClozeCard";
import { Note } from "../../../logic/note";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import CardEditorFooter from "../CardEditorFooter";

interface ClozeCardEditorProps {
  note: Note<CardType.Cloze> | null;
  deck: Deck;
  mode: EditMode;
  onChanged?: () => void;
}

export default function ClozeCardEditor({
  note,
  deck,
  mode,
  onChanged,
}: ClozeCardEditorProps) {
  const [requestedFinish, setRequestedFinish] = useState(false);

  useHotkeys([["mod+Enter", () => setRequestedFinish(true)]]);

  const noteContent = note?.content ?? { type: CardType.Cloze, text: "" };

  //fix sometime
  const editor = useNoteEditor({
    content: noteContent.text,
    finish: () => {
      setRequestedFinish(true);
    },
  });

  const smallestAvailableOcclusionNumber = useMemo(() => {
    const occlusionNumberSet = getOcclusionNumberSet(editor?.getHTML() ?? "");
    for (let i = 1; i < 10; i++) {
      if (!occlusionNumberSet.includes(i)) {
        return i;
      }
    }
    return 9;
  }, [editor?.getHTML()]);

  const clear = useCallback(() => {
    editor?.commands.setContent("");
    editor?.commands.focus();
  }, [editor]);

  useEffect(() => {
    if (requestedFinish) {
      finish(mode, clear, deck, note, editor);
      setRequestedFinish(false);
      onChanged?.();
    }
  }, [requestedFinish, mode, clear, deck, note, editor]);

  return (
    <Stack gap="2rem">
      <NoteEditor
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
  note: Note<CardType.Cloze> | null,
  editor: Editor | null
) {
  if (mode === "edit") {
    //ISSUE newly introduced cards through edit are not recognized
    try {
      if (!note) throw new Error("Note not found");
      await ClozeCardUtils.updateNote(
        {
          text: editor?.getHTML() ?? "",
          occlusionNumberSet: getOcclusionNumberSet(editor?.getHTML() ?? ""),
        },
        note
      );
      successfullySaved();
    } catch {
      saveFailed();
    }
  } else {
    const occlusionNumberSet: number[] = getOcclusionNumberSet(
      editor?.getHTML() ?? ""
    );
    try {
      ClozeCardUtils.createNote(
        {
          text: editor?.getHTML() ?? "",
          occlusionNumberSet: occlusionNumberSet,
        },
        deck
      );
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
      const number = Number.parseInt(numberMatch[1]);
      cardNumbers.add(number);
    }
  });
  return Array.from(cardNumbers);
}

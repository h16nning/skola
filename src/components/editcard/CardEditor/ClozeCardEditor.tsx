import { useHotkeys } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { IconBracketsContain } from "@tabler/icons-react";
import { EditMode } from "../../../logic/TypeManager";
import { CardType } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import classes from "./ClozeCardEditor.module.css";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

import { Stack } from "@mantine/core";
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
}

export default function ClozeCardEditor({
  note,
  deck,
  mode,
}: ClozeCardEditorProps) {
  const [requestedFinish, setRequestedFinish] = useState(false);

  useHotkeys([["mod+Enter", () => setRequestedFinish(true)]]);

  const noteContent = note?.content ?? { type: CardType.Cloze, text: "" };

  //fix sometime
  const editor = useNoteEditor({
    content: noteContent.text,
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
      finish(mode, clear, deck, note, editorContent);
      setRequestedFinish(false);
    }
  }, [requestedFinish, mode, clear, deck, note, editorContent]);

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
  editorContent: string
) {
  if (mode === "edit") {
    //ISSUE newly introduced cards through edit are not recognized
    try {
      if (!note) throw new Error("Note not found");
      await ClozeCardUtils.updateNote(
        {
          text: editorContent,
          occlusionNumberSet: getOcclusionNumberSet(editorContent),
        },
        note
      );
      successfullySaved();
    } catch {
      saveFailed();
    }
  } else {
    const occlusionNumberSet: number[] = getOcclusionNumberSet(editorContent);
    try {
      ClozeCardUtils.createNote(
        {
          text: editorContent,
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
      const number = parseInt(numberMatch[1]);
      cardNumbers.add(number);
    }
  });
  return Array.from(cardNumbers);
}

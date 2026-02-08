import { EditMode } from "@/logic/NoteTypeAdapter";
import { Deck } from "@/logic/deck/deck";
import { NoteType } from "@/logic/note/note";
import { IconBracketsContain } from "@tabler/icons-react";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "@/components/Notification/Notification";
import { RichTextEditorControl } from "@/components/ui/RichTextEditor";
import { Note } from "@/logic/note/note";
import { ClozeNoteTypeAdapter } from "@/logic/type-implementations/cloze/ClozeNote";
import { Editor } from "@tiptap/react";
import { useCallback, useEffect, useMemo } from "react";
import "./ClozeCardEditor.css";

const BASE = "cloze-card-editor";

interface ClozeCardEditorProps {
  note: Note<NoteType.Cloze> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish: boolean;
  setRequestedFinish: (finish: boolean) => void;
  focusSelectNoteType?: () => void;
}

export default function ClozeCardEditor({
  note,
  deck,
  mode,
  requestedFinish,
  setRequestedFinish,
  focusSelectNoteType,
}: ClozeCardEditorProps) {
  const noteContent = note?.content ?? { type: NoteType.Cloze, text: "" };

  const editor = useNoteEditor({
    content: noteContent.text,
    finish: () => {
      setRequestedFinish(true);
    },
    focusSelectNoteType: focusSelectNoteType,
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
    }
  }, [requestedFinish, mode, clear, deck, note, editor]);

  return (
    <NoteEditor
      editor={editor}
      className={BASE}
      controls={
        <RichTextEditorControl
          onClick={() => {
            if (editor?.state.selection.from !== editor?.state.selection.to) {
              const occludedText = `{{c${smallestAvailableOcclusionNumber}::${window.getSelection()}}}`;
              editor?.commands.insertContent(occludedText);
            } else {
              editor?.commands.insertContent(
                `{{c${smallestAvailableOcclusionNumber}::}}`
              );
              editor?.commands.setTextSelection(editor?.state.selection.to - 2);
            }
          }}
          title="Add cloze deletion"
        >
          <IconBracketsContain />
        </RichTextEditorControl>
      }
    />
  );
}

async function finish(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  note: Note<NoteType.Cloze> | null,
  editor: Editor | null
) {
  if (mode === "edit") {
    try {
      if (!note) throw new Error("Note not found");
      await ClozeNoteTypeAdapter.updateNote(
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
      ClozeNoteTypeAdapter.createNote(
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

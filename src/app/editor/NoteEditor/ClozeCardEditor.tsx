import { EditMode } from "@/logic/NoteTypeAdapter";
import { Deck } from "@/logic/deck/deck";
import { NoteType } from "@/logic/note/note";
import { IconBracketsContain } from "@tabler/icons-react";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

import { RichTextEditorControl } from "@/components/ui/RichTextEditor";
import { Note } from "@/logic/note/note";
import { ClozeNoteTypeAdapter } from "@/logic/type-implementations/cloze/ClozeNote";
import { useMemo, useRef } from "react";
import "./ClozeCardEditor.css";
import { useAutoSave, useClearEditors, useNoteCreation } from "./hooks";

const BASE = "cloze-card-editor";

interface ClozeCardEditorProps {
  note: Note<NoteType.Cloze> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish?: boolean;
  setRequestedFinish?: (finish: boolean) => void;
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

  const contentRef = useRef(noteContent.text);

  const getContent = () => ({
    text: contentRef.current,
    occlusionNumberSet: getOcclusionNumberSet(contentRef.current),
  });

  const debouncedAutoSave = useAutoSave(
    mode,
    note,
    getContent,
    ClozeNoteTypeAdapter.updateNote
  );

  const editor = useNoteEditor({
    content: noteContent.text,
    onUpdate: ({ editor }) => {
      contentRef.current = editor.getHTML();
      debouncedAutoSave();
    },
    focusSelectNoteType,
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

  const clear = useClearEditors(editor);

  useNoteCreation(
    mode,
    deck,
    getContent,
    ClozeNoteTypeAdapter.createNote,
    clear,
    requestedFinish,
    setRequestedFinish
  );

  return (
    <NoteEditor
      editor={editor}
      key="editor-1"
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

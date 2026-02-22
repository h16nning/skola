import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { EditMode } from "@/logic/NoteTypeAdapter";
import { Deck } from "@/logic/deck/deck";
import { Note, NoteType } from "@/logic/note/note";
import { BasicNoteTypeAdapter } from "@/logic/type-implementations/normal/BasicNote";
import { t } from "i18next";
import { useCallback, useEffect, useRef } from "react";
import "./NormalCardEditor.css";
import NoteEditor, { useNoteEditor } from "./NoteEditor";
import { useAutoSave, useClearEditors, useNoteCreation } from "./hooks";

const BASE = "normal-card-editor";

interface NormalCardEditorProps {
  note: Note<NoteType.Basic> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish?: boolean;
  setRequestedFinish?: (finish: boolean) => void;
  focusSelectNoteType?: () => void;
}

function NormalCardEditor({
  note,
  deck,
  mode,
  requestedFinish,
  setRequestedFinish,
  focusSelectNoteType,
}: NormalCardEditorProps) {
  const noteContent = note?.content ?? {
    type: NoteType.Basic,
    front: "",
    back: "",
  };

  const frontContentRef = useRef(noteContent.front);
  const backContentRef = useRef(noteContent.back);

  useEffect(() => {
    frontContentRef.current = noteContent.front;
    backContentRef.current = noteContent.back;
  }, [noteContent.front, noteContent.back]);

  const getContent = useCallback(
    () => ({
      front: frontContentRef.current,
      back: backContentRef.current,
    }),
    []
  );

  const debouncedAutoSave = useAutoSave(
    mode,
    note,
    getContent,
    BasicNoteTypeAdapter.updateNote
  );

  const handleFrontUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      frontContentRef.current = editor.getHTML();
      debouncedAutoSave();
    },
    [debouncedAutoSave]
  );

  const handleBackUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      backContentRef.current = editor.getHTML();
      debouncedAutoSave();
    },
    [debouncedAutoSave]
  );

  const frontEditor = useNoteEditor({
    content: noteContent.front,
    onUpdate: handleFrontUpdate,
    focusSelectNoteType,
  });

  const backEditor = useNoteEditor({
    content: noteContent.back,
    onUpdate: handleBackUpdate,
    focusSelectNoteType,
  });

  const clear = useClearEditors(frontEditor, backEditor);

  useNoteCreation(
    mode,
    deck,
    getContent,
    BasicNoteTypeAdapter.createNote,
    clear,
    requestedFinish,
    setRequestedFinish
  );

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" weight="semibold">
          {t("note.edit.type-specific.normal.front")}
        </Text>
        <NoteEditor
          editor={frontEditor}
          key="editor-1"
          className={`${BASE}__front`}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="semibold">
          {t("note.edit.type-specific.normal.back")}
        </Text>
        <NoteEditor editor={backEditor} key="editor-2" />
      </Stack>
    </Stack>
  );
}

export default NormalCardEditor;

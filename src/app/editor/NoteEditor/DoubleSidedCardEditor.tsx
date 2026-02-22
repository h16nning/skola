import NoteEditor, { useNoteEditor } from "@/app/editor/NoteEditor/NoteEditor";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { EditMode } from "@/logic/NoteTypeAdapter";
import { Deck } from "@/logic/deck/deck";
import { Note, NoteType } from "@/logic/note/note";
import { DoubleSidedNoteTypeAdapter } from "@/logic/type-implementations/double-sided/DoubleSidedNote";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./DoubleSidedCardEditor.css";
import { useAutoSave, useClearEditors, useNoteCreation } from "./hooks";

const BASE = "double-sided-card-editor";

interface DoubleSidedCardEditorProps {
  note: Note<NoteType.DoubleSided> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish?: boolean;
  setRequestedFinish?: (finish: boolean) => void;
  focusSelectNoteType?: () => void;
}

function DoubleSidedCardEditor({
  note,
  deck,
  mode,
  requestedFinish,
  setRequestedFinish,
  focusSelectNoteType,
}: DoubleSidedCardEditorProps) {
  const [t] = useTranslation();

  const noteContent = note?.content ?? {
    type: NoteType.DoubleSided,
    field1: "",
    field2: "",
  };

  const field1ContentRef = useRef(noteContent.field1);
  const field2ContentRef = useRef(noteContent.field2);

  useEffect(() => {
    field1ContentRef.current = noteContent.field1;
    field2ContentRef.current = noteContent.field2;
  }, [noteContent.field1, noteContent.field2]);

  const getContent = useCallback(
    () => ({
      field1: field1ContentRef.current,
      field2: field2ContentRef.current,
    }),
    []
  );

  const debouncedAutoSave = useAutoSave(
    mode,
    note,
    getContent,
    DoubleSidedNoteTypeAdapter.updateNote
  );

  const handleEditor1Update = useCallback(
    ({ editor }: { editor: any }) => {
      field1ContentRef.current = editor.getHTML();
      debouncedAutoSave();
    },
    [debouncedAutoSave]
  );

  const handleEditor2Update = useCallback(
    ({ editor }: { editor: any }) => {
      field2ContentRef.current = editor.getHTML();
      debouncedAutoSave();
    },
    [debouncedAutoSave]
  );

  const editor1 = useNoteEditor({
    content: noteContent.field1,
    onUpdate: handleEditor1Update,
    focusSelectNoteType,
  });

  const editor2 = useNoteEditor({
    content: noteContent.field2,
    onUpdate: handleEditor2Update,
    focusSelectNoteType,
  });

  const clear = useClearEditors(editor1, editor2);

  useNoteCreation(
    mode,
    deck,
    getContent,
    DoubleSidedNoteTypeAdapter.createNote,
    clear,
    requestedFinish,
    setRequestedFinish
  );

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Text size="sm" weight="semibold">
          {t("note.edit.type-specific.double-sided.front")}
        </Text>
        <NoteEditor
          editor={editor1}
          key="editor-1"
          className={`${BASE}__field`}
        />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" weight="semibold">
          {t("note.edit.type-specific.double-sided.back")}
        </Text>
        <NoteEditor editor={editor2} key="editor-2" />
      </Stack>
    </Stack>
  );
}

export default DoubleSidedCardEditor;

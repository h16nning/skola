import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteTypeLabels } from "@/logic/card/card";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { getNote } from "@/logic/note/getNote";
import { Note, NoteType } from "@/logic/note/note";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Group } from "@/components/ui/Group";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import LinkedNotesSection from "../explorer/LinkedNotesSection";
import NoteMenu from "./NoteMenu";
import NoteSubmitButton from "./NoteSubmitButton";
import "./EditNoteView.css";

const BASE_URL = "edit-note";

type SetOpenedNote = (note: Note<NoteType> | undefined) => void;

export function EditNoteView({
  note,
  setOpenedNote,
}: {
  note: Note<NoteType> | undefined;
  setOpenedNote?: SetOpenedNote;
}) {
  if (!note) {
    return <NoNoteView />;
  }
  return <NoteView key={note.id} note={note} setOpenedNote={setOpenedNote} />;
}

export function NoNoteView() {
  return (
    <Text size="sm" variant="dimmed">
      No note selected
    </Text>
  );
}

function NoteView({
  note,
  setOpenedNote,
}: {
  note: Note<NoteType>;
  setOpenedNote?: SetOpenedNote;
}) {
  const [t] = useTranslation();
  const [deck] = useDeckOf(note);
  const [requestedFinish, setRequestedFinish] = useState(false);

  const NoteEditor = useMemo(() => {
    return deck
      ? getAdapter(note).editor({
          note,
          deck,
          mode: "edit",
          requestedFinish,
          setRequestedFinish,
        })
      : null;
  }, [note, deck, requestedFinish, setRequestedFinish]);

  return (
    <Stack className={BASE_URL} gap="xl">
      <Group justify="space-between" wrap="nowrap">
        <Group>
          <Text size="xs" weight="semibold">
            {t("note.edit.title")}{" "}
            <Text variant="dimmed" size="xs" weight="semibold">
              ({NoteTypeLabels[note.content.type]})
            </Text>
          </Text>
        </Group>
        <NoteMenu note={note} withEdit={false} />
      </Group>
      {NoteEditor}
      <Group justify="end">
        <NoteSubmitButton finish={() => setRequestedFinish(true)} mode="edit" />
      </Group>
      <LinkedNotesSection
        linkedNotes={note.linkedNotes}
        onSelectNote={
          setOpenedNote
            ? (noteId) => getNote(noteId).then((n) => n && setOpenedNote(n))
            : undefined
        }
      />
    </Stack>
  );
}
export default EditNoteView;

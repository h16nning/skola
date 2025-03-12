import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteTypeLabels } from "@/logic/card/card";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { Note, NoteType } from "@/logic/note/note";
import { Group, Stack, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import NoteMenu from "./NoteMenu";
import NoteSubmitButton from "./NoteSubmitButton";

export function EditNoteView({ note }: { note: Note<NoteType> | undefined }) {
  if (!note) {
    return <NoNoteView />;
  }
  return <NoteView note={note} />;
}

export function NoNoteView() {
  return (
    <Text fz="sm" c="dimmed">
      No note selected
    </Text>
  );
}

function NoteView({ note }: { note: Note<NoteType> }) {
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
    <Stack style={{ height: "100%", overflowY: "scroll" }} gap="xl">
      <Group justify="space-between" wrap="nowrap">
        <Group>
          <Text fz="xs" fw={600}>
            {t("note.edit.title")}{" "}
            <Text c="dimmed" span fz="xs" fw={600}>
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
    </Stack>
  );
}
export default EditNoteView;

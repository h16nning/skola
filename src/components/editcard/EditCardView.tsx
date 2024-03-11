import { Group, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { getUtils } from "../../logic/TypeManager";
import { CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { Note } from "../../logic/note";
import NoteMenu from "./NoteMenu";

function EditCardView() {
  const note = useLoaderData() as Note<CardType> | undefined;
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

function NoteView({ note }: { note: Note<CardType> }) {
  const [deck] = useDeckOf(note);

  const NoteEditor = useMemo(() => {
    return deck ? getUtils(note).editor(note, deck, "edit") : null;
  }, [note, deck]);

  return (
    <Stack style={{ height: "100%", overflowY: "scroll" }}>
      <Group justify="space-between" wrap="nowrap">
        <Group>
          <Text fz="xs" fw={600}>
            Edit Note{" "}
            <Text c="dimmed" span fz="xs" fw={600}>
              ({note.content.type})
            </Text>
          </Text>
        </Group>
        <NoteMenu note={note} withEdit={false} />
      </Group>
      {NoteEditor}
    </Stack>
  );
}
export default EditCardView;

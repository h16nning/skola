import { getAdapter } from "@/logic/NoteTypeAdapter";
import { db } from "@/logic/db";
import { Note, NoteType } from "@/logic/note/note";
import { Anchor, Badge, Box, Group, Stack, Title } from "@mantine/core";
import { useLiveQuery } from "dexie-react-hooks";

interface LinkedNotesSectionProps {
  linkedNotes: Note<any>["linkedNotes"];
  onSelectNote?: (noteId: string) => void;
}

function LinkedNoteDisplay({
  note,
  onSelect,
}: {
  note: Note<NoteType>;
  onSelect?: (noteId: string) => void;
}) {
  return (
    <Anchor
      component="button"
      type="button"
      fz="sm"
      onClick={() => onSelect?.(note.id)}
    >
      {getAdapter(note).getSortFieldFromNoteContent(note.content)}
    </Anchor>
  );
}

export default function LinkedNotesSection({
  linkedNotes,
  onSelectNote,
}: LinkedNotesSectionProps) {
  const linkedNotesKey = JSON.stringify(linkedNotes ?? []);

  const notes = useLiveQuery(async () => {
    if (!linkedNotes || linkedNotes.length === 0) {
      return [];
    }
    return db.notes.bulkGet(linkedNotes);
  }, [linkedNotesKey]);

  const definedNotes = notes?.filter(
    (note): note is Note<NoteType> => note !== undefined
  );

  if (!definedNotes || definedNotes.length === 0) {
    return null;
  }

  return (
    <Box component="section">
      <Group gap="xs">
        <Title order={4} mb={2}>
          Linked Notes
        </Title>
        <Badge color="red" size="xs">
          Beta
        </Badge>
      </Group>
      <Stack gap="xs" align="start">
        {definedNotes.map((note) => (
          <LinkedNoteDisplay
            key={note.id}
            note={note}
            onSelect={onSelectNote}
          />
        ))}
      </Stack>
    </Box>
  );
}

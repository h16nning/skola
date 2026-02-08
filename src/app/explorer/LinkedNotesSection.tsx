import { Badge, Button } from "@/components/ui";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { db } from "@/logic/db";
import { Note, NoteType } from "@/logic/note/note";
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
    <Button size="sm" variant="ghost" onClick={() => onSelect?.(note.id)}>
      {getAdapter(note).getSortFieldFromNoteContent(note.content)}
    </Button>
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
    <section>
      <header>
        <h4>Linked Notes</h4>
        <Badge color="red">Beta</Badge>
      </header>
      <li>
        {definedNotes.map((note) => (
          <LinkedNoteDisplay
            key={note.id}
            note={note}
            onSelect={onSelectNote}
          />
        ))}
      </li>
    </section>
  );
}

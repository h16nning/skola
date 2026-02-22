import { getAdapter } from "@/logic/NoteTypeAdapter";
import { getDeck } from "@/logic/deck/getDeck";
import { getSuperDecks } from "@/logic/deck/getSuperDecks";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { Note, NoteType } from "@/logic/note/note";
import { NoteSorts } from "@/logic/note/sort";
import { useEffect, useState } from "react";

/**
 * Extended note type that includes breadcrumb info for display
 */
export interface NoteWithPreview extends Note<NoteType> {
  breadcrumb: string[];
}

/**
 * Searches and filters notes based on a query string.
 * Enriches matching notes with deck breadcrumb info.
 *
 * 1. Query all notes / filters by  search query
 * 2. Sort results by sort field
 * 3. Enrich each note with full deck path
 *
 * @param filter - The search query string to filter notes
 * @returns Array of notes matching the filter, enriched with breadcrumb paths
 */
export function useSearchNote(filter: string): NoteWithPreview[] {
  const [filteredNotes, setFilteredNotes] = useState<NoteWithPreview[]>([]);
  const [notes] = useNotesWith(
    (n) =>
      n
        .toArray()
        .then((m) =>
          m
            .filter((note) =>
              getAdapter(note)
                .getSortFieldFromNoteContent(note.content)
                .toLowerCase()
                .includes(filter.toLowerCase())
            )
            .sort(NoteSorts.bySortField(1))
        ),
    [filter]
  );

  useEffect(() => {
    async function enrich(notes: Note<NoteType>[]) {
      const decks = await Promise.all(
        notes.map(async (note) => {
          const deck = await getDeck(note.deck);
          const superDecks = await getSuperDecks(deck);
          return [
            ...(superDecks[0] ?? []).map((sd) => sd.name),
            deck?.name ?? "Empty",
          ];
        })
      );
      setFilteredNotes(
        notes.map((note, i) => ({ ...note, breadcrumb: decks[i] }))
      );
    }
    enrich(notes ?? []);
  }, [notes]);

  return filteredNotes;
}

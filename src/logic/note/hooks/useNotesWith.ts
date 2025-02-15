import { Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Note, NoteType } from "../note";

export function useNotesWith(
  querier: (
    notes: Table<Note<NoteType>>
  ) => Promise<Note<NoteType>[] | undefined>,
  dependencies: any[]
): [Note<NoteType>[] | undefined, boolean] {
  return useLiveQuery(
    () => querier(db.notes).then((notes) => [notes, notes !== undefined]),
    dependencies,
    [undefined, false]
  );
}

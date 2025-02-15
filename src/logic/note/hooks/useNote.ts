import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";

export function useNote(noteId: string) {
  return useLiveQuery(() => db.notes.get(noteId), [noteId], undefined);
}

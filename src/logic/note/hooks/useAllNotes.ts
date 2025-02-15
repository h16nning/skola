import { db } from "../../db";

export async function useAllNotes() {
  return db.notes.toArray();
}

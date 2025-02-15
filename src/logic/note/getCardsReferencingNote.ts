import { db } from "../db";
import { Note } from "./note";

export function getCardsReferencingNote(note: Note<any>) {
  return db.cards.where("note").equals(note.id).toArray();
}

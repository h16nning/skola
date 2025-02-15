import { db } from "../db";

export async function renameDeck(id: string, newName: string) {
  return db.decks.update(id, { name: newName });
}

import { db } from "../db";

export async function getDeck(id: string) {
  return db.decks.get(id);
}

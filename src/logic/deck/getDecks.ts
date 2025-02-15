import { db } from "../db";

export async function getDecks(ids: string[]) {
  return db.decks.bulkGet(ids);
}

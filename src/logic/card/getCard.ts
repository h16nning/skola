import { db } from "../db";

export async function getCard(id: string) {
  return db.cards.get(id);
}

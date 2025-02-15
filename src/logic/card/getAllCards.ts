import { db } from "../db";

export async function getAllCards() {
  return db.cards.toArray();
}

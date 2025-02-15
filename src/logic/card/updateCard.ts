import { db } from "../db";

export async function updateCard(
  id: string,
  changes: {
    [keyPath: string]: any;
  }
) {
  return db.cards.update(id, changes);
}

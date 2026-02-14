import { ColorIdentifier } from "@/lib/ColorIdentifier";
import { db } from "../db";

export async function updateDeck(
  id: string,
  name: string,
  description?: string,
  color?: ColorIdentifier
): Promise<void> {
  await db.decks.update(id, {
    name,
    description,
    color,
  });
}

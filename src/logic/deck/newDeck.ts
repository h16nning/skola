import { ColorIdentifier } from "@/lib/ColorIdentifier";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { Deck } from "./deck";

export async function newDeck(
  name: string,
  superDeck?: Deck,
  description?: string,
  color?: ColorIdentifier
): Promise<string> {
  const uuid = uuidv4();

  let superDecks: string[] | undefined = undefined;
  if (superDeck) {
    if (superDeck.superDecks) {
      superDecks = [...superDeck.superDecks, superDeck.id];
    } else {
      superDecks = [superDeck.id];
    }
    const unmodifiedParent = await db.decks.get(superDeck.id);
    if (unmodifiedParent) {
      await db.decks.update(superDeck.id, {
        ...unmodifiedParent,
        subDecks: [...(unmodifiedParent?.subDecks || {}), uuid],
      });
    } else {
      throw Error("Super deck not found");
    }
  }
  await db.decks.add({
    name: name,
    id: uuid,
    cards: [],
    notes: [],
    subDecks: [],
    superDecks: superDecks,
    description: description,
    color: color,
    options: {
      newToReviewRatio: 0.5,
      dailyNewCards: 25,
    },
  });
  return uuid;
}

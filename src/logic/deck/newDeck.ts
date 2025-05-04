import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { Deck } from "./deck";

export async function newDeck(
  name: string,
  superDeck?: Deck,
  description?: string
): Promise<string> {
  const uuid = uuidv4();

  let superDecks: string[] | undefined = undefined;
  let nestingLevel: number;
  if (superDeck) {
    if (superDeck.superDecks) {
      superDecks = [...superDeck.superDecks, superDeck.id];
    } else {
      superDecks = [superDeck.id];
    }
    nestingLevel = superDeck.nestingLevel + 1;
    const unmodifiedParent = await db.decks.get(superDeck.id);
    if (unmodifiedParent) {
      await db.decks.update(superDeck.id, {
        ...unmodifiedParent,
        subDecks: [...(unmodifiedParent?.subDecks || {}), uuid],
      });
    } else {
      throw Error("Super deck not found");
    }
  } else {
    nestingLevel = 0;
  }
  await db.decks.add({
    name: name,
    id: uuid,
    nestingLevel: nestingLevel,
    cards: [],
    notes: [],
    subDecks: [],
    superDecks: superDecks,
    description: description,
    options: {
      newToReviewRatio: 0.5,
      dailyNewCards: 25,
    },
  });
  return uuid;
}

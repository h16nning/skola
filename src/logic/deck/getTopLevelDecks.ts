import { db } from "../db";
import { Deck } from "./deck";

export async function getTopLevelDecks(): Promise<
  [Deck[] | undefined, boolean]
> {
  try {
    const topLevelDecks = await db.decks
      .toArray()
      .then((decks) =>
        decks.filter((d) => !d.superDecks || d.superDecks.length === 0)
      );
    return [topLevelDecks, true];
  } catch {
    return [undefined, true];
  }
}

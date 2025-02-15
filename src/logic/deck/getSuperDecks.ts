import { Deck } from "./deck";
import { getDecks } from "./getDecks";

export async function getSuperDecks(
  deck: Deck | undefined
): Promise<[Deck[] | undefined, boolean]> {
  if (!deck) {
    return [undefined, false];
  }
  try {
    const superDecks = await getDecks(deck.superDecks ?? []);
    if (!superDecks.includes(undefined)) {
      return [superDecks as Deck[], true];
    } else {
      return [undefined, true];
    }
  } catch {
    return [undefined, true];
  }
}

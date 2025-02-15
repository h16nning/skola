import { Deck } from "./deck";
import { getDecks } from "./getDecks";

export async function getSubDecks(
  deck: Deck | undefined
): Promise<[Deck[] | undefined, boolean]> {
  if (!deck) {
    return [undefined, false];
  }
  try {
    const subDecks = await getDecks(deck.subDecks);
    if (!subDecks.includes(undefined)) {
      return [subDecks as Deck[], true];
    } else {
      return [undefined, true];
    }
  } catch {
    return [undefined, true];
  }
}

import { useEffect, useState } from "react";
import { Deck } from "../deck";
import { getSubDecks } from "../getSubDecks";
import { getTopLevelDecks } from "../getTopLevelDecks";

/**
 * Return the subdecks of a deck. If no deck is given only top level decks are returned.
 * @param deck
 * @returns
 */
export function useSubDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [result, setResult] = useState<[Deck[] | undefined, boolean]>([
    undefined,
    false,
  ]);

  useEffect(() => {
    setResult([undefined, false]);
    if (deck) {
      getSubDecks(deck).then((result) => setResult(result));
    } else {
      getTopLevelDecks().then((result) => setResult(result));
    }
  }, [deck]);

  return result;
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Deck } from "../deck";

export function useTopLevelDecks(): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      db.decks
        .filter((deck) => !deck.superDecks)
        .sortBy("name")
        .then((decks) => [decks, true]),
    [],
    [undefined, false]
  );
}

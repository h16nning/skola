import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Deck } from "../deck";

export function useDecks(
  modify?: (decks: Deck[] | undefined) => Deck[] | undefined
): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      db.decks
        .toArray()
        .then((decks) => [modify ? modify(decks) : decks, true]),
    [],
    [undefined, false]
  );
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Deck } from "../deck";

export function useTopLevelDecks(): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    async () => {
      const val = await db.decks
        .toArray()
        .then((decks) =>
          decks.filter((d) => !d.superDecks || d.superDecks.length === 0)
        );
      return [val, true];
    },
    [],
    [undefined, false]
  );
}

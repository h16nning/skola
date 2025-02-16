import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Deck } from "../deck";

export function useTopLevelDecks(): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    async () => {
      //measure time
      const start = performance.now();
      const val = await db.decks.limit(1).toArray();
      const end = performance.now();
      console.log(`useTopLevelDecks took ${end - start} ms`);
      return [val, true];
    },
    [],
    [undefined, false]
  );
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Deck } from "../deck";

export function useTopLevelDecks(): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    async () => {
      // Modifica questa riga per filtrare i deck
      const topLevelDecks = await db.decks
        .where("nestingLevel") // Specifica il campo su cui filtrare (deve essere indicizzato nello schema!)
        .equals(0) // Filtra solo quelli il cui valore è 0
        .toArray(); // Recupera i risultati come array

      return [topLevelDecks, true];
    },
    [],
    [undefined, false]
  );
}

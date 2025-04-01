import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { Deck } from "../deck";

export function useTopLevelDecks(): [Deck[] | undefined, boolean] {
    return useLiveQuery(
        async () => {
            const val = await db.decks.toArray();
            return [val, true];
        },
        [],
        [undefined, false],
    );
}

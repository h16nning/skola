import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router-dom";
import { db } from "../../db";
import { Deck } from "../deck";

export function useDeckFromUrl(): [
  Deck | undefined,
  boolean,
  string | undefined,
] {
  const deckId = useParams().deckId;
  const params = useParams().params;

  return useLiveQuery(
    () => db.decks.get(deckId || "").then((deck) => [deck, true, params]),
    [deckId],
    [undefined, false, undefined]
  );
}

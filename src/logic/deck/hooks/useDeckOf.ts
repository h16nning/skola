import { useLiveQuery } from "dexie-react-hooks";
import { Card } from "../../card/card";
import { db } from "../../db";
import { Note, NoteType } from "../../note/note";
import { Deck } from "../deck";

export function useDeckOf(
  a: Card<NoteType> | Note<NoteType>
): [Deck | undefined, boolean] {
  return useLiveQuery(
    () => db.decks.get(a.deck).then((deck) => [deck, true]),
    [a],
    [undefined, false]
  );
}

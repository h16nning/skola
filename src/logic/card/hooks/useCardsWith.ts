import { Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { NoteType } from "../../note/note";
import { Card } from "../card";

export function useCardsWith(
  querier: (
    cards: Table<Card<NoteType>>
  ) => Promise<Card<NoteType>[] | undefined>,
  dependencies: any[]
): [Card<NoteType>[] | undefined, boolean] {
  return useLiveQuery(
    () => querier(db.cards).then((cards) => [cards, cards !== undefined]),
    dependencies,
    [undefined, false]
  );
}

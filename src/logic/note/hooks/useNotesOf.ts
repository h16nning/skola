import { useLiveQuery } from "dexie-react-hooks";
import { Deck } from "../../deck/deck";
import { getNotesOf } from "../getNotesOf";
import { Note, NoteType } from "../note";

export function useNotesOf(
  deck: Deck | undefined,
  excludeSubDecks?: boolean
): [Note<NoteType>[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      getNotesOf(deck, excludeSubDecks).then((notes) => [
        notes,
        deck !== undefined,
      ]),
    [deck, excludeSubDecks],
    [undefined, false]
  );
}

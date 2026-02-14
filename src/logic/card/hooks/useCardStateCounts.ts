import { useLiveQuery } from "dexie-react-hooks";
import { Deck } from "../../deck/deck";
import { getOrComputeDeckStats } from "../../deck/deckStatsCacheManager";
import { SimplifiedState } from "../getSimplifiedStatesOf";

export function useCardStateCounts(
  deck: Deck | undefined
): [Record<SimplifiedState, number> | undefined, boolean] {
  return useLiveQuery(
    () =>
      deck
        ? getOrComputeDeckStats(deck, true).then((counts) => [counts, true])
        : Promise.resolve([undefined, false]),
    [deck],
    [undefined, false]
  );
}

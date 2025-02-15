import { useMemo } from "react";
import { NoteType } from "../../note/note";
import { Card } from "../card";
import {
  SimplifiedState,
  getSimplifiedStatesOf,
} from "../getSimplifiedStatesOf";

export function useSimplifiedStatesOf(
  cards?: Card<NoteType>[]
): Record<SimplifiedState, number> {
  return useMemo(() => getSimplifiedStatesOf(cards), [cards]);
}

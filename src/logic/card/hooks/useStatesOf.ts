import { State } from "fsrs.js";
import { useMemo } from "react";
import { NoteType } from "../../note/note";
import { Card } from "../card";

export function useStatesOf(cards?: Card<NoteType>[]): Record<State, number> {
  return useMemo(() => {
    const states = {
      [State.New]: 0,
      [State.Learning]: 0,
      [State.Review]: 0,
      [State.Relearning]: 0,
    };
    cards?.forEach((card) => {
      states[card.model.state]++;
    });
    return states;
  }, [cards]);
}

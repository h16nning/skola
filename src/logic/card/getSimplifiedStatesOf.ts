import { State } from "fsrs.js";
import { NoteType } from "../note/note";
import { Card } from "./card";

export type SimplifiedState = "new" | "learning" | "review" | "notDue";

export function getSimplifiedStatesOf(
  cards?: Card<NoteType>[]
): Record<SimplifiedState, number> {
  const states = {
    new: 0,
    learning: 0,
    review: 0,
    notDue: 0,
  };
  cards?.forEach((card) => {
    if (card.model.state === State.New) {
      states.new++;
    } else if (
      card.model.state === State.Learning ||
      card.model.state === State.Relearning
    ) {
      states.learning++;
    } else if (
      card.model.state === State.Review &&
      card.model.due <= new Date(Date.now())
    ) {
      states.review++;
    } else {
      states.notDue++;
    }
  });
  return states;
}

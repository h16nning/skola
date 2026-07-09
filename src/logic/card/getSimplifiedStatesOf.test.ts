import { State } from "fsrs.js";
import { describe, expect, it } from "vitest";
import { NoteType } from "../note/note";
import { Card } from "./card";
import { getSimplifiedStatesOf } from "./getSimplifiedStatesOf";

function cardWith(state: State, due: Date): Card<NoteType> {
  return { model: { state, due } } as Card<NoteType>;
}

const yesterday = new Date(Date.now() - 86400000);
const tomorrow = new Date(Date.now() + 86400000);

describe("getSimplifiedStatesOf", () => {
  it("returns all zeroes without cards", () => {
    expect(getSimplifiedStatesOf()).toEqual({
      new: 0,
      learning: 0,
      review: 0,
      notDue: 0,
    });
  });

  it("counts relearning as learning", () => {
    const states = getSimplifiedStatesOf([
      cardWith(State.Learning, yesterday),
      cardWith(State.Relearning, yesterday),
    ]);
    expect(states.learning).toBe(2);
  });

  it("counts a review card as due only when its due date has passed", () => {
    const states = getSimplifiedStatesOf([
      cardWith(State.New, tomorrow),
      cardWith(State.Review, yesterday),
      cardWith(State.Review, tomorrow),
    ]);
    expect(states).toEqual({ new: 1, learning: 0, review: 1, notDue: 1 });
  });
});

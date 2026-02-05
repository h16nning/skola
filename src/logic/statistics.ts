import { useLiveQuery } from "dexie-react-hooks";
import { Rating, State } from "fsrs.js";
import { db } from "./db";

export interface DeckStatistics {
  deck: string;
  day: string;
  time: {
    total: number;
    forNew: number;
    forReview: number;
    forLearning: number;
  };
  cards: {
    [State.New]: number;
    [State.Review]: number;
    [State.Learning]: number;
    [State.Relearning]: number;
  };
  ratingsList: Rating[];
}

export function newStatistics(): DeckStatistics {
  return {
    deck: "[not set]",
    day: new Date().toISOString().split("T")[0],
    time: {
      total: 0,
      forNew: 0,
      forReview: 0,
      forLearning: 0,
    },
    cards: {
      [State.New]: 0,
      [State.Review]: 0,
      [State.Learning]: 0,
      [State.Relearning]: 0,
    },
    ratingsList: [],
  };
}
export async function writeStatistics(statistics: DeckStatistics) {
  const existingStats = await db.statistics.get([
    statistics.deck,
    statistics.day,
  ]);

  if (existingStats) {
    db.statistics.put({
      deck: statistics.deck,
      day: statistics.day,
      time: {
        total: existingStats.time.total + statistics.time.total,
        forNew: existingStats.time.forNew + statistics.time.forNew,
        forReview: existingStats.time.forReview + statistics.time.forReview,
        forLearning:
          existingStats.time.forLearning + statistics.time.forLearning,
      },
      cards: {
        [State.New]:
          existingStats.cards[State.New] + statistics.cards[State.New],
        [State.Review]:
          existingStats.cards[State.Review] + statistics.cards[State.Review],
        [State.Learning]:
          existingStats.cards[State.Learning] +
          statistics.cards[State.Learning],
        [State.Relearning]:
          existingStats.cards[State.Relearning] +
          statistics.cards[State.Relearning],
      },
      ratingsList: existingStats.ratingsList.concat(statistics.ratingsList),
    });
  } else {
    db.statistics.add(statistics);
  }
}

export async function getStatistics(deck?: string, day?: string) {
  if (deck && day) {
    return db.statistics.get({ deck, day });
  } else if (deck) {
    return db.statistics.where("deck").equals(deck).toArray();
  } else if (day) {
    return db.statistics.where("day").equals(day).toArray();
  } else {
    return db.statistics.toArray();
  }
}

export function useStatistics(deck?: string, day?: string) {
  return useLiveQuery(() => getStatistics(deck, day), [deck, day]);
}

import { Content } from "./CardContent";
import { v4 as uuidv4 } from "uuid";
import { Deck } from "./deck";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { newRepetition, Repetition } from "./Repetition";
import { ReviewModel, sm2 } from "./SpacedRepetition";
import { useEffect, useMemo, useState } from "react";

export enum CardType {
  Normal = "normal",
  Cloze = "cloze",
  ImageOcclusion = "imageOcclusion",
}

export interface CardSkeleton {
  id: string;
  history: Repetition[];
  model: ReviewModel;
  decks: string[];
  dueDate: Date | null;
  creationDate: Date;
}

export interface Card<T extends CardType> extends CardSkeleton {
  content: Content<T>;
}

export function createCardSkeleton(): CardSkeleton {
  const id = uuidv4();
  return {
    id: id,
    history: [],
    decks: [],
    dueDate: null,
    model: { repetitions: 0, easeFactor: 2.5, interval: 0, learned: false },
    creationDate: new Date(Date.now()),
  };
}

function isCard(card: Card<CardType> | undefined): card is Card<CardType> {
  return !!card;
}
export async function newCard(card: Card<CardType>, deck: Deck) {
  if (deck.superDecks) {
    card.decks = [deck.id, ...deck.superDecks];
  } else {
    card.decks = [deck.id];
  }
  deck.cards.push(card.id);
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.add(card, card.id);
    db.decks.update(deck.id, { cards: deck.cards });
  });
}

export async function updateCard(
  id: string,
  changes: {
    [keyPath: string]: any;
  }
) {
  return db.cards.update(id, changes);
}

export async function deleteCard(card: Card<CardType>) {
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.delete(card.id);
    db.decks.get(card.decks[0]).then((d) => {
      if (d?.id) {
        db.decks.update(d.id, {
          cards: d.cards.filter((c) => c !== card.id),
        });
      }
    });
  });
}

/*export async function learnCard(potentiallyOldCard: Card<CardType>, learned: boolean) {
  const card = await getCard(potentiallyOldCard.id);
  if (card) {
    card.model.learned = learned;
    const dueDate = new Date();
    await updateCard(card.id, {
      model: card.model,
      history: [...card.history, newRepetition(quality)],
      dueDate: dueDate,
    });
  }
}*/

export async function answerCard(
  potentiallyOldCard: Card<CardType>,
  quality: number,
  learned: boolean
) {
  //The card object passed does not have to represent the current version stored in the database due to the implementation in LearnView. Therefore, the card is loaded from the database.
  const card = await getCard(potentiallyOldCard.id);
  if (card) {
    card.model.learned = learned;
    const newModel = sm2(quality, card.model);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + newModel.interval);
    await updateCard(card.id, {
      model: newModel,
      history: [...card.history, newRepetition(quality)],
      dueDate: dueDate,
    });
  }
}

export function useCards() {
  return useLiveQuery(() => db.cards.orderBy("content.front").toArray());
}

export function useCardsOf(
  deck: Deck | undefined
): [Card<CardType>[] | undefined, boolean] {
  return useLiveQuery(
    () => getCardsOf(deck).then((cards) => [cards, deck !== undefined]),
    [deck],
    [undefined, false]
  );
}
export async function getCardsOf(
  deck?: Deck
): Promise<Card<CardType>[] | undefined> {
  if (!deck) return undefined;
  let cards: Card<CardType>[] = await db.cards
    .where("id")
    .anyOf(deck.cards)
    .filter((c) => isCard(c))
    .toArray();
  await Promise.all(
    deck.subDecks.map((subDeckID) =>
      db.decks
        .get(subDeckID)
        .then((subDeck) => {
          if (subDeck) {
            return getCardsOf(subDeck);
          }
        })
        .then((c) => {
          if (c) {
            cards = cards.concat(c);
          }
        })
    )
  );
  return cards;
}

export async function getCard(id: string) {
  return db.cards.get(id);
}

export function getStateOf(
  card: Card<CardType>
): "due" | "learned" | "new" | "learning" {
  if (card.history.length === 0) {
    return "new";
  } else {
    if (card.model.interval !== 0) {
      if (!card.dueDate || card.dueDate?.getTime() <= Date.now()) {
        return "due";
      } else {
        return "learned";
      }
    } else {
      return "learning";
    }
  }
}

export function useStatsOf(cards?: Card<CardType>[]): CardsStats {
  return useMemo(() => {
    let dueCounter = 0;
    let learnedCounter = 0;
    let newCounter = 0;
    let learningCounter = 0;

    cards?.forEach((card) => {
      if (card.history.length === 0) {
        newCounter++;
      } else {
        if (card.model.interval !== 0) {
          if (!card.dueDate || card.dueDate?.getTime() <= Date.now()) {
            dueCounter++;
          } else {
            learnedCounter++;
          }
        } else {
          learningCounter++;
        }
      }
    });
    return {
      dueCards: dueCounter,
      learnedCards: learnedCounter,
      newCards: newCounter,
      learningCards: learningCounter,
    };
  }, [cards]);
}

export type CardsStats = {
  dueCards: number | null;
  learnedCards: number | null;
  newCards: number | null;
  learningCards: number | null;
};

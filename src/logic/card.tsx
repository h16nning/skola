import { Content } from "./CardContent";
import { v4 as uuidv4 } from "uuid";
import { Deck } from "./deck";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { newRepetition, Repetition } from "./Repetition";
import { useMemo } from "react";
import { Table } from "dexie";
import { Card as Model, State } from "fsrs.js";
import { scheduler } from "./CardScheduler";

export enum CardType {
  Normal = "normal",
  Cloze = "cloze",
  ImageOcclusion = "imageOcclusion",
  DoubleSided = "doubleSided",
  Undefined = "undefined",
}

export interface CardSkeleton {
  id: string;
  history: Repetition[];
  model: Model;
  deck: string;
  creationDate: Date;
  frame?: string | undefined;
}

export interface Card<T extends CardType> extends CardSkeleton {
  content: Content<T>;
}

export function createCardSkeleton(): CardSkeleton {
  const id = uuidv4();
  return {
    id: id,
    history: [],
    deck: "",
    model: new Model(),
    creationDate: new Date(Date.now()),
  };
}

function isCard(card: Card<CardType> | undefined): card is Card<CardType> {
  return !!card;
}
export async function newCard(card: Card<CardType>, deck: Deck) {
  card.deck = deck.id;
  deck.cards.push(card.id);
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.add(card, card.id);
    db.decks.update(deck.id, { cards: deck.cards });
  });
}

export async function newCards(cards: Card<CardType>[], deck: Deck) {
  cards.forEach((card) => (card.deck = deck.id));
  deck.cards.push(...cards.map((card) => card.id));
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.bulkAdd(cards);
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

export async function updateCardModel(card: Card<CardType>, model: Model) {
  return db.cards.update(card.id, { model: model });
}

export async function moveCard(card: Card<CardType>, newDeck: Deck) {
  //Remove card from old deck
  const oldDeck = await db.decks.get(card.deck);
  if (oldDeck) {
    oldDeck.cards = oldDeck.cards.filter((c) => c !== card.id);
    await db.decks.update(oldDeck.id, { cards: oldDeck.cards });
  }
  newDeck.cards.push(card.id);
  //Add card to new deck
  await db.decks.update(newDeck.id, { cards: newDeck.cards });
  //Update in card object
  card.deck = newDeck.id;
  return db.cards.update(card.id, { deck: newDeck.id });
}

export async function deleteCard(card: Card<CardType>) {
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.delete(card.id);
    db.decks.get(card.deck).then((d) => {
      if (d?.id) {
        db.decks.update(d.id, {
          cards: d.cards.filter((c) => c !== card.id),
        });
      }
    });
  });
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

export function useCardsWith(
  querier: (
    cards: Table<Card<CardType>>
  ) => Promise<Card<CardType>[] | undefined>,
  dependencies: any[]
): [Card<CardType>[] | undefined, boolean] {
  return useLiveQuery(
    () => querier(db.cards).then((cards) => [cards, cards !== undefined]),
    dependencies,
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

export function useStatesOf(cards?: Card<CardType>[]): Record<State, number> {
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

export type ThreeTypeState = "new" | "learning" | "review";

export function useSimplifiedStatesOf(
  cards?: Card<CardType>[]
): Record<ThreeTypeState, number> {
  return useMemo(() => {
    const states = {
      new: 0,
      learning: 0,
      review: 0,
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
      }
    });
    return states;
  }, [cards]);
}

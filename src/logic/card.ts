import { Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { Card as Model, ReviewLog, State } from "fsrs.js";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Content } from "./CardContent";
import { db } from "./db";
import { Deck } from "./deck";

export enum NoteType {
  Normal = "normal",
  Cloze = "cloze",
  ImageOcclusion = "imageOcclusion",
  DoubleSided = "doubleSided",
  Undefined = "undefined",
}

export interface CardSkeleton {
  id: string;
  history: ReviewLog[];
  model: Model;
  deck: string;
  creationDate: Date;
  customOrder?: number;
}

export interface Card<T extends NoteType> extends CardSkeleton {
  content: Content<T>;
  note: string;
}

export function createCardSkeleton(): CardSkeleton {
  const id = uuidv4();
  return {
    id: id,
    history: [],
    deck: "[preview not set]",
    model: new Model(),
    creationDate: new Date(Date.now()),
  };
}

function isCard(card: Card<NoteType> | undefined): card is Card<NoteType> {
  return !!card;
}

/**
 * This function creates a new card in the database.
 *
 * **Side effects:** It also updates the deck to include the new card.
 */
export async function newCard(card: Card<NoteType>, deck: Deck) {
  card.deck = deck.id;
  deck.cards.push(card.id);
  await db.transaction("rw", db.decks, db.cards, () => {
    db.cards.add(card, card.id);
    db.decks.update(deck.id, { cards: deck.cards });
  });
  return card.id;
}

export async function newCards(cards: Card<NoteType>[], deck: Deck) {
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

export async function updateCardModel(
  card: Card<NoteType>,
  model: Model,
  log: ReviewLog
) {
  return db.cards.update(card.id, {
    model: model,
    history: [...card.history, log],
  });
}

export async function moveCard(card: Card<NoteType>, newDeck: Deck) {
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

export async function deleteCard(card: Card<NoteType>) {
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

export async function getCard(id: string) {
  return db.cards.get(id);
}

export async function getAllCards() {
  return db.cards.toArray();
}

export async function getCardsOf(
  deck?: Deck,
  excludeSubDecks?: boolean
): Promise<Card<NoteType>[] | undefined> {
  if (!deck) return undefined;
  let cards: Card<NoteType>[] = await db.cards
    .where("id")
    .anyOf(deck.cards)
    .filter((c) => isCard(c))
    .toArray();
  if (excludeSubDecks) {
    return cards;
  }
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

export function useCardsOf(
  deck: Deck | undefined,
  excludeSubDecks?: boolean
): [Card<NoteType>[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      getCardsOf(deck, excludeSubDecks).then((cards) => [
        cards,
        deck !== undefined,
      ]),
    [deck, excludeSubDecks],
    [undefined, false]
  );
}

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
export function useSimplifiedStatesOf(
  cards?: Card<NoteType>[]
): Record<SimplifiedState, number> {
  return useMemo(() => getSimplifiedStatesOf(cards), [cards]);
}

export function toPreviewString(text: string): string {
  return text.replace(/<[^>]*>/g, "").slice(0, 100);
}

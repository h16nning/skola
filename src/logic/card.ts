import { Content } from "./CardContent";
import { v4 as uuidv4 } from "uuid";
import { Deck } from "./deck";
import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

export enum CardType {
  Normal = "normal",
  Cloze = "cloze",
  ImageOcclusion = "imageOcclusion",
}

export interface CardSkeleton {
  id: string;
  history: Array<Object>;
  decks: string[];
}

export interface Card<T extends CardType> extends CardSkeleton {
  content: Content<T>;
}

export function createCardSkeleton(): CardSkeleton {
  const id = uuidv4();
  return { id: id, history: [], decks: ["-1"] };
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
    deck.superDecks?.forEach((d) =>
      db.decks.get(d).then((d) => {
        if (d) {
          db.decks.update(d, { cards: [...d.cards, card.id] });
        }
      })
    );
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
    db.decks.delete(card.decks[0]);
    card.decks.forEach((d) =>
      db.decks.get(d).then((d) => {
        if (d?.id) {
          db.decks.update(d.id, {
            cards: d.cards.filter((c) => c !== card.id),
          });
        }
      })
    );
  });
}

export function useCards() {
  return useLiveQuery(() => db.cards.orderBy("content.front").toArray());
}

export function useCardsOf(deck: Deck): Card<CardType>[] {
  return useLiveQuery(() => getCardsOf(deck), [deck]) ?? [];
}
export async function getCardsOf(deck: Deck) {
  return db.cards
    .where("id")
    .anyOf(deck.cards ?? [])
    .filter((c) => isCard(c))
    .toArray();
}

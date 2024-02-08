import { Card, CardType } from "./card";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export interface Deck {
  id: string;
  name: string;
  subDecks: string[];
  superDecks?: string[];
  cards: Array<string>;
  description?: string;
  options: DeckOptions;
}

export interface DeckOptions {
  newToReviewRatio: number;
  dailyNewCards: number;
}

export async function newDeck(
  name: string,
  superDeck?: Deck,
  description?: string
): Promise<IndexableType> {
  const uuid = uuidv4();

  let superDecks: string[] | undefined = undefined;
  if (superDeck) {
    if (superDeck.superDecks) {
      superDecks = [...superDeck.superDecks, superDeck.id];
    } else {
      superDecks = [superDeck.id];
    }
    const unmodifiedParent = await db.decks.get(superDeck.id);
    if (unmodifiedParent) {
      await db.decks.update(superDeck.id, {
        ...unmodifiedParent,
        subDecks: [...(unmodifiedParent?.subDecks || {}), uuid],
      });
    } else {
      throw Error("Super deck not found");
    }
  }
  await db.decks.add({
    name: name,
    id: uuid,
    cards: [],
    subDecks: [],
    superDecks: superDecks,
    description: description,
    options: {
      newToReviewRatio: 0.5,
      dailyNewCards: 25,
    },
  });
  return uuid;
}

export function useDeckOf(card: Card<CardType>): [Deck | undefined, boolean] {
  return useLiveQuery(
    () => db.decks.get(card.deck).then((deck) => [deck, true]),
    [card],
    [undefined, false]
  );
}

export function useDecks(
  modify?: (decks: Deck[] | undefined) => Deck[] | undefined
): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      db.decks
        .toArray()
        .then((decks) => [modify ? modify(decks) : decks, true]),
    [],
    [undefined, false]
  );
}

export function useTopLevelDecks(): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    () =>
      db.decks
        .filter((deck) => !deck.superDecks)
        .sortBy("name")
        .then((decks) => [decks, true]),
    [],
    [undefined, false]
  );
}

export function useSubDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [result, setResult] = useState<[Deck[] | undefined, boolean]>([
    undefined,
    false,
  ]);

  useEffect(() => {
    setResult([undefined, false]);
    void determineSubDecks(deck).then((result) => setResult(result));
  }, [deck]);

  return result;
}

async function determineSubDecks(
  deck: Deck | undefined
): Promise<[Deck[] | undefined, boolean]> {
  if (!deck) {
    return [undefined, false];
  }
  try {
    const subDecks = await getDecks(deck.subDecks);
    if (!subDecks.includes(undefined)) {
      return [subDecks as Deck[], true];
    } else {
      return [undefined, true];
    }
  } catch (error) {
    return [undefined, true];
  }
}

export function useSuperDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [result, setResult] = useState<[Deck[] | undefined, boolean]>([
    undefined,
    false,
  ]);

  useEffect(() => {
    setResult([undefined, false]);
    void determineSuperDecks(deck).then((result) => setResult(result));
  }, [deck]);

  return result;
}

async function determineSuperDecks(
  deck: Deck | undefined
): Promise<[Deck[] | undefined, boolean]> {
  if (!deck) {
    return [undefined, false];
  }
  try {
    const superDecks = await getDecks(deck.superDecks ?? []);
    if (!superDecks.includes(undefined)) {
      return [superDecks as Deck[], true];
    } else {
      return [undefined, true];
    }
  } catch (error) {
    return [undefined, true];
  }
}

export async function getDeck(id: string) {
  return db.decks.get(id);
}

export async function getDecks(ids: string[]) {
  return db.decks.bulkGet(ids);
}

export async function renameDeck(id: string, newName: string) {
  return db.decks.update(id, { name: newName });
}

export async function deleteDeck(deck: Deck, calledRecursively?: boolean) {
  await db.transaction("rw", db.decks, db.cards, () => {
    if (!deck) {
      return;
    }

    Promise.all(
      deck.subDecks.map((subDeckID) =>
        getDeck(subDeckID).then(
          (subDeck) => subDeck && deleteDeck(subDeck, true)
        )
      )
    );

    if (
      !calledRecursively &&
      deck.superDecks &&
      deck.superDecks[deck.superDecks.length - 1]
    ) {
      getDeck(deck.superDecks[deck.superDecks.length - 1]).then(
        (superDeck) =>
          superDeck &&
          db.decks.update(superDeck.id, {
            ...superDeck,
            subDecks: superDeck?.subDecks.filter((s) => s !== deck.id),
          })
      );
    }

    Promise.all(deck.cards.map((cardID) => db.cards.delete(cardID)));

    db.decks.delete(deck.id);
  });
}

export function useDeckFromUrl(): [
  Deck | undefined,
  boolean,
  string | undefined,
] {
  const location = useLocation();
  const [id, setID] = useState<string | undefined>(undefined);
  const [params, setParams] = useState<string | undefined>(undefined);

  useEffect(() => {
    setID(location.pathname.split("/")[2]);
    setParams(location.pathname.split("/")[3]);
  }, [location]);

  return useLiveQuery(
    () => db.decks.get(id ?? "").then((deck) => [deck, true, params]),
    [id],
    [undefined, false, undefined]
  );
}

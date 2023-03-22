import { Card, CardType, deleteCard } from "./card";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useDebugValue, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
export interface Deck {
  id: string;
  name: string;
  subDecks: string[];
  superDecks?: string[];
  cards: Array<string>;
}

export const dummyDeck: Deck = {
  id: "no_id",
  name: "-",
  subDecks: [],
  cards: [],
};
export async function newDeck(
  name: string,
  superDeck?: Deck
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
        subDecks: [...unmodifiedParent?.subDecks, uuid],
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
  });
  return uuid;
}

export function useDeckOf(card: Card<CardType>): [Deck | undefined, boolean] {
  return useLiveQuery(
    () => db.decks.get(card.decks[0]).then((deck) => [deck, true]),
    [card],
    [undefined, false]
  );
}

export function useDecks(): [Deck[] | undefined, boolean] {
  return useLiveQuery(
    () => db.decks.toArray().then((decks) => [decks, true]),
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
  if (!deck) {
    return;
  }
  for (const subDeck of deck?.subDecks) {
    const s = await db.decks.get(subDeck);
    if (s) {
      await deleteDeck(s, true);
    }
  }
  if (deck.superDecks && deck.superDecks[0] && !calledRecursively) {
    const superDeck = await getDeck(deck.superDecks[0]);
    if (superDeck) {
      console.log("remove from super");
      console.log(deck.id);
      await db.decks.update(superDeck.id, {
        ...superDeck,
        subDecks: superDeck?.subDecks.filter((s) => s !== deck.id),
      });
    }
  }
  deck.cards.forEach((c) =>
    db.cards.get(c).then((c) => {
      if (c) {
        deleteCard(c);
      }
    })
  );
  await db.decks.delete(deck.id);
}

export function useDeckFromUrl(): [Deck | undefined, boolean] {
  const location = useLocation();
  const [id, setID] = useState<string | undefined>(undefined);

  useEffect(() => {
    setID(location.pathname.split("/")[2]);
  }, [location]);

  return useLiveQuery(
    () => db.decks.get(id ?? "").then((deck) => [deck, true]),
    [id],
    [undefined, false]
  );
}

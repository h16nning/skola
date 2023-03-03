import { Card, CardType } from "./card";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useDebugValue, useEffect, useState } from "react";
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

/**
 * Type guard for Deck
 * @param deck
 */
function isDeck(deck: unknown): deck is Deck {
  return (deck as Deck).subDecks !== undefined;
}

export function useDeckOf(card: Card<CardType>) {
  return useLiveQuery(() => db.decks.get(card.decks[0]));
}

export function useDecks() {
  return useLiveQuery(() => db.decks.toArray());
}

export function useTopLevelDecks() {
  return useLiveQuery(() =>
    db.decks.filter((deck) => !deck.superDecks).sortBy("name")
  );
}

export function useSubDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [subDecks, setSubDecks] = useState<Deck[] | undefined>(undefined);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    setSubDecks(undefined);
    setFailed(false);
    void determineSubDecks(deck, setSubDecks, setFailed);
  }, [deck]);

  useDebugValue(deck);

  return [subDecks, failed];
}

async function determineSubDecks(
  deck: Deck | undefined,
  setSubDecks: Function,
  setFailed: Function
) {
  if (deck) {
    try {
      const sd = await getDecks(deck.subDecks);
      const includesUndefined = sd.includes(undefined);
      if (sd !== undefined && !includesUndefined) {
        setSubDecks(sd as Deck[]);
      } else {
        setSubDecks(undefined);
        setFailed(true);
      }
    } catch (error) {
      setFailed(true);
    }
  }
}

export function useSuperDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [superDecks, setSuperDecks] = useState<Deck[] | undefined>(undefined);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    setSuperDecks(undefined);
    setFailed(false);
    void determineSuperDecks();
  }, [deck]);

  async function determineSuperDecks() {
    if (deck) {
      if (deck.superDecks) {
        try {
          const sd = await getDecks(deck.superDecks);
          const includesUndefined = sd.includes(undefined);
          if (sd !== undefined && !includesUndefined) {
            setSuperDecks(sd as Deck[]);
          } else {
            setSuperDecks(undefined);
            setFailed(true);
          }
        } catch (error) {
          setFailed(true);
        }
      } else {
        setSuperDecks([]);
      }
    }
  }
  useDebugValue(deck);

  return [superDecks, failed];
}

export async function getDeck(id: string) {
  return db.decks.get(id);
}

export async function getDecks(ids: string[]) {
  return db.decks.bulkGet(ids);
}

export async function deleteDeck(id: string, calledRecursively?: boolean) {
  const deck = await getDeck(id);
  if (!deck) {
    return;
  }
  for (const subDeck of deck?.subDecks) {
    await deleteDeck(subDeck, true);
  }
  if (deck.superDecks && deck.superDecks[0] && !calledRecursively) {
    const superDeck = await getDeck(deck.superDecks[0]);
    if (superDeck) {
      await db.decks.update(superDeck.id, {
        ...superDeck,
        subDecks: superDeck?.subDecks.filter((s) => s !== deck.id),
      });
    }
  }
  await db.decks.delete(id);
}

export function useDeckFromUrl(): [Deck | undefined, boolean, Function] {
  const [deck, setDeck] = useState<Deck | undefined>();
  const [failed, setFailed] = useState<boolean>(false);
  const [reFetch, setReFetch] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    const id = location.pathname.split("/")[2];
    if (id) {
      void tryFetchDeck(id);
    } else {
      setFailed(true);
    }
  }, [location, reFetch]);

  async function tryFetchDeck(id: string) {
    const d = await getDeck(id);
    if (d === undefined) {
      setFailed(true);
    }
    setDeck(d);
  }

  function reload() {
    setReFetch(!reFetch);
  }

  return [deck, failed, reload];
}

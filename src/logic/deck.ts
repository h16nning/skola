import { Card } from "./card";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useDebugValue, useEffect, useState } from "react";
import { getDate } from "@mantine/dates/lib/components/TimeInputBase/get-date/get-date";

export interface Deck {
  id: string;
  name: string;
  subDecks: string[];
  superDecks?: string[];
  cards: Array<Card>;
}

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

export function useDecks() {
  return useLiveQuery(() => db.decks.toArray());
}

export function useSubDecks(deck?: Deck): [Deck[] | undefined, boolean] {
  const [subDecks, setSubDecks] = useState<Deck[] | undefined>(undefined);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    setSubDecks(undefined);
    setFailed(false);
    void determineSubDecks();
  }, [deck]);

  async function determineSubDecks() {
    if (deck) {
      try {
        //await new Promise((resolve) => setTimeout(resolve, 5000));
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
  useDebugValue(deck);

  return [subDecks, failed];
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
          //await new Promise((resolve) => setTimeout(resolve, 5000));
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

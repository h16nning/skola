import { Card, CardType, deleteCard } from "./card";
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

  const [id, setID] = useState<string | null>(null);
  const deck = useLiveQuery(() => db.decks.get(id ?? ""), [id]);
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    const sequence = location.pathname.split("/")[2];
    if (sequence) {
      setID(sequence);
    } else {
      setFailed(true);
    }
  }, [location]);

  return [deck, failed];
}

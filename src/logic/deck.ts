import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Card, NoteType } from "./card";
import { db } from "./db";
import { Note } from "./note";

export interface Deck {
  id: string;
  name: string;
  subDecks: string[];
  superDecks?: string[];
  cards: Array<string>;
  notes: Array<string>;
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
): Promise<string> {
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
    notes: [],
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

export function useDeckOf(
  a: Card<NoteType> | Note<NoteType>
): [Deck | undefined, boolean] {
  return useLiveQuery(
    () => db.decks.get(a.deck).then((deck) => [deck, true]),
    [a],
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
  } catch {
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

export async function determineSuperDecks(
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
  } catch {
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
  await db.transaction("rw", db.decks, db.cards, db.notes, async () => {
    if (!deck) {
      return;
    }

    await Promise.all(
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

    await Promise.all(deck.cards.map((cardID) => db.cards.delete(cardID)));
    await Promise.all(deck.notes.map((noteID) => db.notes.delete(noteID)));
    db.decks.delete(deck.id);
  });
}

export function useDeckFromUrl(): [
  Deck | undefined,
  boolean,
  string | undefined,
] {
  const deckId = useParams().deckId;
  const params = useParams().params;

  return useLiveQuery(
    () => db.decks.get(deckId || "").then((deck) => [deck, true, params]),
    [deckId],
    [undefined, false, undefined]
  );
}

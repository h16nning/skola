import { Card } from "./card";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { IndexableType } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";

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

export function getPlaceholderDeck() {
  return { id: "placeholder id", cards: [], name: "", subdecks: [] };
}

export function getEmptyDeck() {
  return { id: uuidv4(), cards: [], name: "", subdecks: [] };
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

export function useSubdecks(deck: Deck) {
  const [subDecks, setSubDecks] = useState();
  useEffect(() => {
    //getSubdecks
  }, [deck]);
  return subDecks;
}

export async function getDeck(id: string) {
  return db.decks.get(id);
}

// @ts-ignore
export async function deleteDeck(id: string) {
  await db.decks.delete(id);
}

import Dexie, { Table } from "dexie";
import { Deck } from "./deck";
import { Card, CardType } from "./card";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<CardType>>;

  constructor() {
    super("database");
    this.version(1).stores({
      decks: "++id, name, subDecks, *superDecks, cards",
      cards: "++id, content, history",
    });
  }
}

export const db = new Database();

import Dexie, { Table } from "dexie";
import { Deck } from "./deck";
import { Card, CardType } from "./card";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<CardType>>;

  constructor() {
    super("database");
    this.version(1).stores({
      cards: "++id, content.front, history",
      decks: "++id, name, subDecks, *superDecks, cards",
    });
    this.open();
  }
}

export const db = new Database();

import Dexie, { Table } from "dexie";
import { Deck } from "./deck";

export class Database extends Dexie {
  decks!: Table<Deck>;

  constructor() {
    super("database");
    this.version(1).stores({
      decks: "++id, name, subdecks, cards",
    });
  }
}

export const db = new Database();

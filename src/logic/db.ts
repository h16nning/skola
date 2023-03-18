import Dexie, { Table } from "dexie";
import { Deck } from "./deck";
import { Card, CardType } from "./card";
import { Settings, SettingsValues } from "./Settings";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<CardType>>;
  settings!: Table<Settings<keyof SettingsValues>>;

  constructor() {
    super("database");
    this.version(2).stores({
      cards: "++id, content.front, history",
      decks: "++id, name, subDecks, *superDecks, cards",
      settings: "++key",
    });
    this.open();
  }
}

export const db = new Database();

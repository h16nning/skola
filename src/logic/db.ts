import Dexie, { Table } from "dexie";
import "dexie-export-import";
import { Settings, SettingsValues } from "./Settings";
import { Card, CardType } from "./card";
import { Deck } from "./deck";
import { Note } from "./note";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<CardType>>;
  notes!: Table<Note<CardType>>;
  settings!: Table<Settings<keyof SettingsValues>>;

  constructor() {
    super("database");
    this.version(7).stores({
      cards: "++id",
      decks: "++id",
      notes: "++id",
      settings: "++key",
    });
    this.open();
  }
}

export const db = new Database();

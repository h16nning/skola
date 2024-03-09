import Dexie, { Table } from "dexie";
import "dexie-export-import";
import { Settings, SettingsValues } from "./Settings";
import { Card, CardType } from "./card";
import { Deck } from "./deck";
import { Note } from "./note";
import { DeckStatistics } from "./statistics";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<CardType>>;
  notes!: Table<Note<CardType>>;
  statistics!: Table<DeckStatistics>;
  settings!: Table<Settings<keyof SettingsValues>>;

  constructor() {
    super("database");
    this.version(13).stores({
      cards: "++id, note",
      decks: "++id",
      notes: "++id",
      statistics: "[deck+day], day",
      settings: "++key",
    });
    this.open();
  }
}

export const db = new Database();

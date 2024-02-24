import Dexie, { Table } from "dexie";
import "dexie-export-import";
import { Deck } from "./deck";
import { Card, CardType } from "./card";
import { Settings, SettingsValues } from "./Settings";
import { SharedValue } from "./sharedvalue";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<CardType>>;
  sharedvalues!: Table<SharedValue>;
  settings!: Table<Settings<keyof SettingsValues>>;

  constructor() {
    super("database");
    this.version(5).stores({
      cards: "++id",
      decks: "++id",
      sharedvalues: "++id",
      settings: "++key",
    });
    this.open();
  }
}

export const db = new Database();

import Dexie, { Table } from "dexie";
import "dexie-export-import";
import dexieCloud from "dexie-cloud-addon";
import { Settings, SettingsValues } from "./Settings";
import { Card, NoteType } from "./card";
import { Deck } from "./deck";
import { Note } from "./note";
import { DeckStatistics } from "./statistics";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<NoteType>>;
  notes!: Table<Note<NoteType>>;
  statistics!: Table<DeckStatistics>;
  settings!: Table<Settings<keyof SettingsValues>>;

  constructor() {
    super("database", { addons: [dexieCloud] });
    this.version(16).stores({
      cards: "id, note",
      decks: "id",
      notes: "id",
      statistics: "[deck+day], day",
      settings: "key",
    });
    this.open();
  }
}

export const db = new Database();

db.cloud.configure({
  databaseUrl: "https://zo30f12v5.dexie.cloud",
  tryUseServiceWorker: true,
});

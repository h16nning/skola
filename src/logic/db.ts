import Dexie, { Table } from "dexie";
import "dexie-export-import";
import dexieCloud from "dexie-cloud-addon";
import { Card } from "./card/card";
import { Deck } from "./deck/deck";
import { NoteType } from "./note/note";
import { Note } from "./note/note";
import { Settings, SettingsValues } from "./settings/Settings";
import { DeckStatistics } from "./statistics";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<NoteType>>;
  notes!: Table<Note<NoteType>>;
  statistics!: Table<DeckStatistics>;
  settings!: Table<Settings<keyof SettingsValues>>;

  constructor() {
    super("skola_db", { addons: [dexieCloud], cache: "immutable" });
    this.version(22).stores({
      cards: "id, note, deck",
      decks: "id, *cards, *notes, *subDecks, *superDecks",
      notes: "id, deck, sortField, *linkedNotes",
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
  customLoginGui: true,
});

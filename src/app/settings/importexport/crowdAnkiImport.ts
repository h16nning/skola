import type { Deck } from "@/logic/deck/deck";

export interface ExtractedCrowdAnkiData {
  description: string;
  name: string;
  fields: { label: string; value: string }[];
  cards: { fields: Record<string, string> }[];
  warnMessages: string[];
}

interface CrowdAnkiNoteModelField {
  name: string;
  ord: number;
}

interface CrowdAnkiNote {
  fields: string[];
}

interface CrowdAnkiDeck {
  __type__: string;
  desc?: string;
  name?: string;
  note_models?: { flds?: CrowdAnkiNoteModelField[] }[];
  notes?: CrowdAnkiNote[];
}

interface AnkiJsonCard {
  deckName?: string;
  fields?: Record<string, string>;
  modelName?: string;
  tags?: string[];
}

type CreateBasicNote = (
  params: { front: string; back: string },
  deck: Deck
) => Promise<string | undefined> | undefined;

type CreateBasicNotes = (
  params: { front: string; back: string }[],
  deck: Deck
) => Promise<void>;

export function parseCrowdAnkiFile(fileText: string | null) {
  if (!fileText) {
    throw new Error("This file has no contents.");
  }

  const jsonObject = JSON.parse(fileText) as CrowdAnkiDeck | AnkiJsonCard[];
  const warnMessages: string[] = [];

  if (Array.isArray(jsonObject)) {
    return parseAnkiJsonCards(jsonObject);
  }

  if (jsonObject.__type__ !== "Deck") {
    throw new Error("At the moment only CrowdAnki decks can be imported.");
  }

  const noteModels = jsonObject.note_models;
  if (!noteModels || noteModels.length === 0) {
    throw new Error("No note models found.");
  }

  if (noteModels.length > 1) {
    warnMessages.push(
      "Multiple note models found, only cards of the first one will be used."
    );
  }

  const firstNoteModel = noteModels[0];
  const fields = firstNoteModel.flds;
  if (!fields || fields.length < 2) {
    throw new Error("The first note model must have at least two fields.");
  }

  const notes = jsonObject.notes;
  if (!notes || notes.length === 0) {
    throw new Error("No notes found.");
  }

  return {
    description: jsonObject.desc ?? "",
    name: jsonObject.name ?? "Imported Deck",
    fields: fields.map((field) => ({
      label: field.name,
      value: field.ord.toString(),
    })),
    cards: notes.map((note) => ({
      fields: Object.fromEntries(
        note.fields.map((fieldValue, index) => [index.toString(), fieldValue])
      ),
    })),
    warnMessages,
  } satisfies ExtractedCrowdAnkiData;
}

function parseAnkiJsonCards(cards: AnkiJsonCard[]) {
  if (cards.length === 0) {
    throw new Error("No cards found.");
  }

  const firstCard = cards[0];
  const fieldNames = Object.keys(firstCard.fields ?? {});
  if (fieldNames.length < 2) {
    throw new Error("Cards must have at least two fields.");
  }

  return {
    description: "",
    name: firstCard.deckName ?? "Imported Deck",
    fields: fieldNames.map((fieldName) => ({
      label: fieldName,
      value: fieldName,
    })),
    cards: cards
      .filter((card) => card.fields)
      .map((card) => ({
        fields: card.fields ?? {},
      })),
    warnMessages: [],
  } satisfies ExtractedCrowdAnkiData;
}

export async function importCrowdAnkiCards(
  extractedData: ExtractedCrowdAnkiData,
  deck: Deck | undefined,
  frontField: string | null,
  backField: string | null,
  createBasicNote: CreateBasicNote,
  createBasicNotes?: CreateBasicNotes
) {
  if (!deck) {
    throw new Error("No destination deck selected.");
  }

  if (!frontField || !backField) {
    throw new Error("Front and back fields must be selected.");
  }

  const cards = extractedData.cards.flatMap((card) => {
    const front = card.fields[frontField];
    const back = card.fields[backField];

    if (!front || !back) {
      return [];
    }

    return [{ front, back }];
  });

  if (createBasicNotes) {
    await createBasicNotes(cards, deck);
    return;
  }

  for (const card of cards) {
    await createBasicNote(card, deck);
  }
}

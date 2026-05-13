import type { Deck } from "@/logic/deck/deck";
import { describe, expect, it, vi } from "vitest";
import {
  type ExtractedCrowdAnkiData,
  importCrowdAnkiCards,
  parseCrowdAnkiFile,
} from "./crowdAnkiImport";

const sampleCrowdAnkiDeck = {
  __type__: "Deck",
  name: "English",
  desc: "Vocabulary cards",
  note_models: [
    {
      flds: [
        { name: "Front", ord: 0 },
        { name: "Back", ord: 1 },
        { name: "Extra", ord: 2 },
      ],
    },
  ],
  notes: [
    {
      fields: ["Solstice", "Солнцестояние", "noun"],
    },
    {
      fields: ["reluctance", "Нежелание", ""],
    },
  ],
};

const deck: Deck = {
  id: "deck-id",
  name: "English",
  subDecks: [],
  cards: [],
  notes: [],
  options: {
    dailyNewCards: 20,
    newToReviewRatio: 1,
  },
};

describe("parseCrowdAnkiFile", () => {
  it("extracts fields and notes from a CrowdAnki deck", () => {
    const parsed = parseCrowdAnkiFile(JSON.stringify(sampleCrowdAnkiDeck));

    expect(parsed).toEqual({
      description: "Vocabulary cards",
      name: "English",
      fields: [
        { label: "Front", value: "0" },
        { label: "Back", value: "1" },
        { label: "Extra", value: "2" },
      ],
      cards: [
        { fields: { "0": "Solstice", "1": "Солнцестояние", "2": "noun" } },
        { fields: { "0": "reluctance", "1": "Нежелание", "2": "" } },
      ],
      warnMessages: [],
    });
  });

  it("extracts cards from Anki-style JSON arrays", () => {
    const ankiCards = [
      {
        deckName: "English Words",
        modelName: "Basic",
        fields: {
          Front: "Solstice",
          Back: "Солнцестояние",
        },
      },
    ];

    expect(parseCrowdAnkiFile(JSON.stringify(ankiCards))).toEqual({
      description: "",
      name: "English Words",
      fields: [
        { label: "Front", value: "Front" },
        { label: "Back", value: "Back" },
      ],
      cards: [
        {
          fields: {
            Front: "Solstice",
            Back: "Солнцестояние",
          },
        },
      ],
      warnMessages: [],
    });
  });

  it("reports multiple note models while still using the first model", () => {
    const parsed = parseCrowdAnkiFile(
      JSON.stringify({
        ...sampleCrowdAnkiDeck,
        note_models: [
          sampleCrowdAnkiDeck.note_models[0],
          { flds: [{ name: "Other", ord: 0 }] },
        ],
      })
    );

    expect(parsed.warnMessages).toEqual([
      "Multiple note models found, only cards of the first one will be used.",
    ]);
    expect(parsed.fields[0]).toEqual({ label: "Front", value: "0" });
  });
});

describe("importCrowdAnkiCards", () => {
  it("creates basic notes using the selected front and back fields", async () => {
    const createBasicNote = vi.fn().mockResolvedValue("note-id");
    const parsed = parseCrowdAnkiFile(JSON.stringify(sampleCrowdAnkiDeck));

    await importCrowdAnkiCards(parsed, deck, "0", "1", createBasicNote);

    expect(createBasicNote).toHaveBeenCalledTimes(2);
    expect(createBasicNote).toHaveBeenNthCalledWith(
      1,
      {
        front: "Solstice",
        back: "Солнцестояние",
      },
      deck
    );
    expect(createBasicNote).toHaveBeenNthCalledWith(
      2,
      {
        front: "reluctance",
        back: "Нежелание",
      },
      deck
    );
  });

  it("skips cards missing the selected fields", async () => {
    const createBasicNote = vi.fn().mockResolvedValue("note-id");
    const parsed: ExtractedCrowdAnkiData = {
      ...parseCrowdAnkiFile(JSON.stringify(sampleCrowdAnkiDeck)),
      cards: [
        { fields: { "0": "Front only" } },
        { fields: { "0": "Front", "1": "Back" } },
      ],
    };

    await importCrowdAnkiCards(parsed, deck, "0", "1", createBasicNote);

    expect(createBasicNote).toHaveBeenCalledTimes(1);
    expect(createBasicNote).toHaveBeenCalledWith(
      { front: "Front", back: "Back" },
      deck
    );
  });

  it("supports field-name mappings from Anki-style JSON arrays", async () => {
    const createBasicNote = vi.fn().mockResolvedValue("note-id");
    const parsed = parseCrowdAnkiFile(
      JSON.stringify([
        {
          deckName: "English Words",
          fields: {
            Front: "to cast about for smth",
            Back: "Искать, подыскивать",
          },
        },
      ])
    );

    await importCrowdAnkiCards(parsed, deck, "Front", "Back", createBasicNote);

    expect(createBasicNote).toHaveBeenCalledWith(
      {
        front: "to cast about for smth",
        back: "Искать, подыскивать",
      },
      deck
    );
  });

  it("uses the bulk creator when one is provided", async () => {
    const createBasicNote = vi.fn().mockResolvedValue("note-id");
    const createBasicNotes = vi.fn().mockResolvedValue(undefined);
    const parsed = parseCrowdAnkiFile(JSON.stringify(sampleCrowdAnkiDeck));

    await importCrowdAnkiCards(
      parsed,
      deck,
      "0",
      "1",
      createBasicNote,
      createBasicNotes
    );

    expect(createBasicNote).not.toHaveBeenCalled();
    expect(createBasicNotes).toHaveBeenCalledTimes(1);
    expect(createBasicNotes).toHaveBeenCalledWith(
      [
        { front: "Solstice", back: "Солнцестояние" },
        { front: "reluctance", back: "Нежелание" },
      ],
      deck
    );
  });
});

import { describe, expect, it } from "vitest";
import { NoteType } from "./note";
import { noteMatchesSearch } from "./search";

const baseNote = {
  id: "note-id",
  deck: "deck-id",
  creationDate: new Date("2026-05-11"),
  linkedNotes: [],
  sortField: "front only",
};

describe("noteMatchesSearch", () => {
  it("matches basic notes by front and back content", () => {
    const note = {
      ...baseNote,
      content: {
        type: NoteType.Basic,
        front: "reluctance",
        back: "Нежелание, сопротивление",
      },
    };

    expect(noteMatchesSearch(note, "reluctance")).toBe(true);
    expect(noteMatchesSearch(note, "сопротивление")).toBe(true);
  });

  it("matches double-sided notes by both fields", () => {
    const note = {
      ...baseNote,
      content: {
        type: NoteType.DoubleSided,
        field1: "Solstice",
        field2: "Солнцестояние",
      },
    };

    expect(noteMatchesSearch(note, "Solstice")).toBe(true);
    expect(noteMatchesSearch(note, "Солнцестояние")).toBe(true);
  });

  it("strips html before matching", () => {
    const note = {
      ...baseNote,
      content: {
        type: NoteType.Basic,
        front: "<p>cast about</p>",
        back: "<strong>подыскивать</strong>",
      },
    };

    expect(noteMatchesSearch(note, "подыскивать")).toBe(true);
  });
});

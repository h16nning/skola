import { describe, expect, it } from "vitest";
import { NoteType } from "./note";
import { getNotePreviewText } from "./preview";

const baseNote = {
  id: "note-id",
  deck: "deck-id",
  creationDate: new Date("2026-05-11"),
  linkedNotes: [],
  sortField: "front only",
};

describe("getNotePreviewText", () => {
  it("combines front and back for basic notes", () => {
    const note = {
      ...baseNote,
      content: {
        type: NoteType.Basic,
        front: "<p>Solstice</p>",
        back: "<strong>Солнцестояние</strong>",
      },
    };

    expect(getNotePreviewText(note)).toBe("Solstice — Солнцестояние");
  });

  it("combines both fields for double-sided notes", () => {
    const note = {
      ...baseNote,
      content: {
        type: NoteType.DoubleSided,
        field1: "reluctance",
        field2: "Нежелание, сопротивление",
      },
    };

    expect(getNotePreviewText(note)).toBe(
      "reluctance — Нежелание, сопротивление"
    );
  });
});

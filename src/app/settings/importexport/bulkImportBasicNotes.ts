import { HTMLtoPreviewString } from "@/logic/card/card";
import { createCardSkeleton } from "@/logic/card/createCardSkeleton";
import { db } from "@/logic/db";
import type { Deck } from "@/logic/deck/deck";
import { invalidateDeckStatsCache } from "@/logic/deck/deckStatsCacheManager";
import { createNoteSkeleton } from "@/logic/note/createNoteSkeleton";
import { NoteType } from "@/logic/note/note";

interface BasicNoteImport {
  front: string;
  back: string;
}

export async function bulkImportBasicNotes(
  params: BasicNoteImport[],
  deck: Deck
) {
  if (params.length === 0) {
    return;
  }

  const notes = params.map((card) => {
    const content = {
      type: NoteType.Basic,
      front: card.front,
      back: card.back,
    };

    return {
      ...createNoteSkeleton(deck.id),
      content,
      sortField: HTMLtoPreviewString(card.front),
    };
  });

  const cards = notes.map((note) => ({
    ...createCardSkeleton(),
    deck: deck.id,
    note: note.id,
    content: { type: NoteType.Basic },
  }));

  const nextNoteIds = notes.map((note) => note.id);
  const nextCardIds = cards.map((card) => card.id);

  await db.transaction("rw", db.notes, db.cards, db.decks, async () => {
    await db.notes.bulkAdd(notes);
    await db.cards.bulkAdd(cards);
    await db.decks.update(deck.id, {
      notes: [...deck.notes, ...nextNoteIds],
      cards: [...deck.cards, ...nextCardIds],
    });
  });

  deck.notes.push(...nextNoteIds);
  deck.cards.push(...nextCardIds);

  await invalidateDeckStatsCache(deck.id);
}

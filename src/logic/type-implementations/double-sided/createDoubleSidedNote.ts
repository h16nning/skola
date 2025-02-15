import { HTMLtoPreviewString } from "@/logic/card/card";
import { createCardSkeleton } from "@/logic/card/createCardSkeleton";
import { newCard } from "@/logic/card/newCard";
import { db } from "@/logic/db";
import { Deck } from "@/logic/deck/deck";
import { newNote } from "@/logic/note/newNote";
import { NoteType } from "@/logic/note/note";

export default async function createDoubleSidedNote(
  params: { field1: string; field2: string },
  deck: Deck
) {
  function createDoubleSidedCard(
    noteId: string,
    frontIsField1: boolean,
    front: string
  ) {
    return {
      ...createCardSkeleton(),
      note: noteId,
      preview: HTMLtoPreviewString(front),
      content: {
        type: NoteType.DoubleSided,
        frontIsField1: frontIsField1,
      },
    };
  }
  return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
    const noteId = await newNote(deck, {
      type: NoteType.DoubleSided,
      field1: params.field1,
      field2: params.field2,
    });
    await newCard(createDoubleSidedCard(noteId, true, params.field1), deck);
    await newCard(createDoubleSidedCard(noteId, false, params.field2), deck);
  });
}

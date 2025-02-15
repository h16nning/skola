import { db } from "../db";
import { NoteType } from "../note/note";
import { Card } from "./card";

export async function deleteCard(card: Card<NoteType>) {
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.delete(card.id);
    db.decks.get(card.deck).then((d) => {
      if (d?.id) {
        db.decks.update(d.id, {
          cards: d.cards.filter((c) => c !== card.id),
        });
      }
    });
  });
}

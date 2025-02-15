import { db } from "../db";
import { Deck } from "../deck/deck";
import { NoteType } from "../note/note";
import { Card } from "./card";

export async function newCards(cards: Card<NoteType>[], deck: Deck) {
  cards.forEach((card) => (card.deck = deck.id));
  deck.cards.push(...cards.map((card) => card.id));
  return db.transaction("rw", db.decks, db.cards, () => {
    db.cards.bulkAdd(cards);
    db.decks.update(deck.id, { cards: deck.cards });
  });
}

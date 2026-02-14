import { db } from "../db";
import { Deck } from "../deck/deck";
import { invalidateDeckStatsCache } from "../deck/deckStatsCacheManager";
import { NoteType } from "../note/note";
import { Card } from "./card";

/**
 * This function creates a new card in the database.
 *
 * **Side effects:** It also updates the deck to include the new card.
 */

export async function newCard(card: Card<NoteType>, deck: Deck) {
  card.deck = deck.id;
  deck.cards.push(card.id);
  await db.transaction("rw", db.decks, db.cards, () => {
    db.cards.add(card, card.id);
    db.decks.update(deck.id, { cards: deck.cards });
  });

  await invalidateDeckStatsCache(deck.id);
  return card.id;
}

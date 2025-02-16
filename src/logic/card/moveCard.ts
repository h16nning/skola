import { db } from "../db";
import { Deck } from "../deck/deck";
import { NoteType } from "../note/note";
import { Card } from "./card";

/**
 * Deprecated, consider disallowing moving single cards between decks
 * @param card 
 * @param newDeck 
 * @returns 
 */
export async function moveCard(card: Card<NoteType>, newDeck: Deck) {
  //Remove card from old deck
  const oldDeck = await db.decks.get(card.deck);
  if (oldDeck) {
    oldDeck.cards = oldDeck.cards.filter((c) => c !== card.id);
    await db.decks.update(oldDeck.id, { cards: oldDeck.cards });
  }
  newDeck.cards.push(card.id);
  //Add card to new deck
  await db.decks.update(newDeck.id, { cards: newDeck.cards });
  //Update in card object
  card.deck = newDeck.id;
  return db.cards.update(card.id, { deck: newDeck.id });
}

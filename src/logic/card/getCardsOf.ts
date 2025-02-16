import { db } from "../db";
import { Deck } from "../deck/deck";
import { NoteType } from "../note/note";
import { Card } from "./card";

export async function getCardsOf(
  deck?: Deck,
  excludeSubDecks?: boolean
): Promise<Card<NoteType>[] | undefined> {
  if (!deck) return undefined;
  let cards: Card<NoteType>[] = (await db.cards.bulkGet(deck.cards)).filter(
    (c) => c !== undefined
  );
  if (excludeSubDecks) {
    return cards;
  }
  await Promise.all(
    deck.subDecks.map((subDeckID) =>
      db.decks
        .get(subDeckID)
        .then((subDeck) => {
          if (subDeck) {
            return getCardsOf(subDeck);
          }
        })
        .then((c) => {
          if (c) {
            cards = cards.concat(c);
          }
        })
    )
  );
  return cards;
}

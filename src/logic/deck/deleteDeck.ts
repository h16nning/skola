import { db } from "../db";
import { Deck } from "./deck";
import { getDeck } from "./getDeck";

export async function deleteDeck(deck: Deck, calledRecursively?: boolean) {
  await db.transaction("rw", db.decks, db.cards, db.notes, async () => {
    if (!deck) {
      return;
    }

    await Promise.all(
      deck.subDecks.map((subDeckID) =>
        getDeck(subDeckID).then(
          (subDeck) => subDeck && deleteDeck(subDeck, true)
        )
      )
    );

    if (
      !calledRecursively &&
      deck.superDecks &&
      deck.superDecks[deck.superDecks.length - 1]
    ) {
      getDeck(deck.superDecks[deck.superDecks.length - 1]).then(
        (superDeck) =>
          superDeck &&
          db.decks.update(superDeck.id, {
            ...superDeck,
            subDecks: superDeck?.subDecks.filter((s) => s !== deck.id),
          })
      );
    }

    await Promise.all(deck.cards.map((cardID) => db.cards.delete(cardID)));
    await Promise.all(deck.notes.map((noteID) => db.notes.delete(noteID)));
    db.decks.delete(deck.id);
  });
}

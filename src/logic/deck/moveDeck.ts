import { db } from "../db";

export async function moveDeck(deckId: string, newSuperDeckId: string) {
  return db.transaction("rw", db.decks, async () => {
    // Get the deck with the given id
    const deck = await db.decks.get(deckId);
    if (!deck) {
      throw new Error(`Deck with id ${deckId} not found`);
    }

    // Get the new superdeck with the given id
    const newSuperDeck = await db.decks.get(newSuperDeckId);
    if (!newSuperDeck) {
      throw new Error(`Deck with id ${newSuperDeckId} not found`);
    } else {
      db.decks.update(newSuperDeck.id, {
        subDecks: [...newSuperDeck.subDecks, deckId],
      });
    }

    if (deck.superDecks) {
      const oldSuperDeck = await db.decks.get(
        deck.superDecks[deck.superDecks.length - 1]
      );

      // remove deck from old superdeck
      if (oldSuperDeck) {
        if (oldSuperDeck.id === newSuperDeckId) {
          console.warn(
            "Tried to move deck to its current superdeck. Ignoring."
          );
          return;
        }

        await db.decks.update(oldSuperDeck.id, {
          subDecks: oldSuperDeck.subDecks.filter(
            (subDeckId) => subDeckId !== deckId
          ),
        });
      }
    }
    await db.decks.update(deck, {
      superDecks: [...(newSuperDeck.superDecks ?? []), newSuperDeckId],
    });
  });
}

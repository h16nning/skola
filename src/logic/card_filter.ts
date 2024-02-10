import { Collection, IndexableType, Table } from "dexie";
import { Card, CardType, getCardsOf } from "./card";
import { getUtils } from "./CardTypeManager";
import { getDeck } from "./deck";

export default async function selectCards(
  cards: Table<Card<CardType>>,
  deckGiven: boolean,
  filter: string,
  sort: [string, boolean],
  location: any
): Promise<Card<CardType>[] | undefined> {
  let filteredCards:
    | Table<Card<CardType>>
    | Collection<Card<CardType>, IndexableType>
    | Card<CardType>[] = cards;
  if (deckGiven) {
    const deckId = location.pathname.split("/")[2];
    filteredCards =
      (await getDeck(deckId).then((deck) => getCardsOf(deck))) ?? [];
  }

  const cardsArray: Card<CardType>[] = Array.isArray(filteredCards)
    ? filteredCards
    : await filteredCards.toArray();

  let comparableFilteredCards = await Promise.all(
    cardsArray.map(async (card) => {
      return {
        ...card,
        preview: await getUtils(card).displayPreview(card),
      };
    })
  );
  if (filter.length > 0) {
    console.log(filter);
    comparableFilteredCards = comparableFilteredCards.filter((card) =>
      // @ts-ignore
      card.preview
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }
  if (sort[0] === "front") {
    if (sort[1]) {
      return comparableFilteredCards.sort((a, b) => {
        return a.preview.localeCompare(b.preview);
      });
    } else {
      return comparableFilteredCards.sort((a, b) => {
        return b.preview.localeCompare(a.preview);
      });
    }
  } else if (sort[0] === "creation_date") {
    if (sort[1]) {
      return comparableFilteredCards.sort((a, b) => {
        return a.creationDate.getTime() - b.creationDate.getTime();
      });
    } else {
      return comparableFilteredCards.sort((a, b) => {
        return b.creationDate.getTime() - a.creationDate.getTime();
      });
    }
  } else if (sort[0] === "deck") {
    const comparableDeckFilteredCards = await Promise.all(
      comparableFilteredCards.map(async (card) => {
        return {
          ...card,
          deckName: await getDeck(card.deck).then(
            (deck) => deck?.name ?? "test"
          ),
        };
      })
    );
    if (sort[1]) {
      return comparableDeckFilteredCards.sort((a, b) =>
        a.deckName.localeCompare(b.deckName)
      );
    } else {
      return comparableDeckFilteredCards.sort((a, b) =>
        b.deckName.localeCompare(a.deckName)
      );
    }
  } else {
    return comparableFilteredCards;
  }
}

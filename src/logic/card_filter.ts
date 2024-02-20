import { Collection, IndexableType, Table } from "dexie";
import { CardSorts, getCardsWithComparableDeckName } from "./CardSorting";
import { Card, CardType, getCardsOf } from "./card";
import { getDeck } from "./deck";

export type SortOption = "sort_field" | "creation_date" | "deck" | "type";

function sortToNumber(sort: boolean) {
  return sort ? 1 : -1;
}

export default async function selectCards(
  cards: Table<Card<CardType>>,
  deckId: string | undefined,
  filter: string,
  sort: [SortOption, boolean]
): Promise<Card<CardType>[] | undefined> {
  let filteredCards:
    | Table<Card<CardType>>
    | Collection<Card<CardType>, IndexableType>
    | Card<CardType>[] = cards;
  if (deckId) {
    filteredCards =
      (await getDeck(deckId).then((deck) => getCardsOf(deck))) ?? [];
  }

  let cardsArray: Card<CardType>[] = Array.isArray(filteredCards)
    ? filteredCards
    : await filteredCards.toArray();

  if (filter.length > 0) {
    cardsArray = cardsArray.filter((card) => {
      if (card.preview === undefined) {
        console.warn(
          "card.preview is undefined. Most likely due to old db date."
        );
        return true;
      }
      return card.preview?.toLowerCase().includes(filter.toLowerCase());
    });
  }
  if (sort[0] === "sort_field") {
    return cardsArray.sort(CardSorts.bySortField(sortToNumber(sort[1])));
  } else if (sort[0] === "creation_date") {
    return cardsArray.sort(CardSorts.byCreationDate(sortToNumber(sort[1])));
  } else if (sort[0] === "type") {
    return cardsArray.sort(CardSorts.byCardType(sortToNumber(sort[1])));
  } else if (sort[0] === "deck") {
    const comparableFilteredCards =
      await getCardsWithComparableDeckName(cardsArray);
    return comparableFilteredCards.sort(
      CardSorts.byDeckName(sortToNumber(sort[1]))
    );
  } else {
    return cardsArray;
  }
}

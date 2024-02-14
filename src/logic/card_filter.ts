import { Collection, IndexableType, Table } from "dexie";
import {
  CardSorts,
  getCardsWithComparableDeckName,
  getCardsWithComparablePreview,
} from "./CardSorting";
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

  const cardsArray: Card<CardType>[] = Array.isArray(filteredCards)
    ? filteredCards
    : await filteredCards.toArray();

  let comparableFilteredCards = await getCardsWithComparablePreview(cardsArray);

  if (filter.length > 0) {
    console.log(filter);
    comparableFilteredCards = comparableFilteredCards.filter((card) =>
      // @ts-ignore
      card.preview
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }
  if (sort[0] === "sort_field") {
    return comparableFilteredCards.sort(
      CardSorts.bySortField(sortToNumber(sort[1]))
    );
  } else if (sort[0] === "creation_date") {
    return comparableFilteredCards.sort(
      CardSorts.byCreationDate(sortToNumber(sort[1]))
    );
  } else if (sort[0] === "type") {
    return comparableFilteredCards.sort(
      CardSorts.byCardType(sortToNumber(sort[1]))
    );
  } else if (sort[0] === "deck") {
    const comparableDeckFilteredCards = await getCardsWithComparableDeckName(
      comparableFilteredCards
    );
    return comparableDeckFilteredCards.sort(
      CardSorts.byDeckName(sortToNumber(sort[1]))
    );
  } else {
    return comparableFilteredCards;
  }
}

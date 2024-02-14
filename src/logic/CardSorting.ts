import { getUtils } from "./CardTypeManager";
import { Card, CardType } from "./card";
import { getDeck } from "./deck";

export type CardSortFunction = (sortOrder: 1 | -1) => (...args: any) => number;

export const CardSorts: Record<any, CardSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
      (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder,
  bySortField:
    (sortOrder: 1 | -1) =>
    (a: CardWithComparablePreview, b: CardWithComparablePreview) =>
      a.preview.localeCompare(b.preview) * sortOrder,
  byCustomOrder:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) => {
      if (a.customOrder === undefined || b.customOrder === undefined) {
        return 0;
      }
      return (a.customOrder - b.customOrder) * Math.abs(sortOrder);
    },
  byCardType: (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
    a.content.type.localeCompare(b.content.type) * sortOrder,
  byDeckName:
    (sortOrder: 1 | -1) =>
    (a: CardWithComparableDeckName, b: CardWithComparableDeckName) =>
      a.deckName.localeCompare(b.deckName) * sortOrder,
};
export interface CardWithComparablePreview extends Card<CardType> {
  preview: string;
}

export function getCardsWithComparablePreview(
  cards: Card<CardType>[]
): Promise<CardWithComparablePreview[]> {
  return Promise.all(
    cards.map(async (card) => {
      return {
        ...card,
        preview: await getUtils(card).displayPreview(card),
      };
    })
  );
}

export interface CardWithComparableDeckName extends Card<CardType> {
  deckName: string;
}

export async function getCardsWithComparableDeckName(
  cards: Card<CardType>[]
): Promise<CardWithComparableDeckName[]> {
  return Promise.all(
    cards.map(async (card) => {
      return {
        ...card,
        deckName:
          (await getDeck(card.deck).then((deck) => deck?.name)) ?? "error",
      };
    })
  );
}

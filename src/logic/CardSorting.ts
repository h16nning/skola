import { getUtils } from "./CardTypeManager";
import { Card, CardType } from "./card";

export type CardSortFunction = (
  sortOrder: 1 | -1
) => (a: Card<CardType>, b: Card<CardType>) => number;

export const CardSorts: Record<any, CardSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
      (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder,
  bySortField: (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
    (getUtils(a).displayPreview(a) as string).localeCompare(
      getUtils(b).displayPreview(b) as string
    ) * sortOrder,
  byCustomOrder:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) => {
      if (a.customOrder === undefined || b.customOrder === undefined) {
        return 0;
      }
      return (a.customOrder - b.customOrder) * Math.abs(sortOrder);
    },
};

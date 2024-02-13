import { getUtils } from "./CardTypeManager";
import { Card, CardType } from "./card";

export type CardSortFunction = (
  sortOrder: 1 | -1
) => (a: Card<CardType>, b: Card<CardType>) => number;

export const CardSorts: Record<any, CardSortFunction> = {
  byCreationDate:
    (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) => {
      try {
        return (
          (a.creationDate.getTime() - b.creationDate.getTime()) * sortOrder
        );
      } catch (e) {
        console.log(e);
        return 0;
      }
    },
  bySortField: (sortOrder: 1 | -1) => (a: Card<CardType>, b: Card<CardType>) =>
    (getUtils(a).displayPreview(a) > getUtils(b).displayPreview(b) ? 1 : -1) *
    sortOrder,
};

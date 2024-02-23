import { ReactNode } from "react";
import { Card, CardType } from "./card";
import { Deck } from "./deck";
import { NormalCardUtils } from "./CardTypeImplementations/NormalCard";
import { ClozeCardUtils } from "./CardTypeImplementations/ClozeCard";
import { DoubleSidedCardUtils } from "./CardTypeImplementations/DoubleSidedCard";
import { UndefinedCardUtils } from "./CardTypeImplementations/UndefinedCard";

export interface CardTypeManager<T extends CardType> {
  create: (params: any) => Card<T>;

  update: (params: any, existingCard: Card<T>) => Card<T>;

  displayInNotebook: (card: Card<T>) => ReactNode;

  displayQuestion(card: Card<T>): ReactNode;

  displayAnswer(card: Card<T>): ReactNode;

  editor(card: Card<CardType> | null, deck: Deck, mode: EditMode): JSX.Element;

  delete: (card: Card<T>) => void;
}

export type EditMode = "edit" | "new";

export function getUtils(card: Card<CardType>): CardTypeManager<CardType> {
  return getUtilsOfType(card.content ? card.content.type : CardType.Undefined);
}

export function getUtilsOfType(cardType: CardType): CardTypeManager<CardType> {
  switch (cardType) {
    case CardType.Normal:
      // @ts-ignore
      return NormalCardUtils;
    case CardType.Cloze:
      // @ts-ignore
      return ClozeCardUtils;
    case CardType.DoubleSided:
      // @ts-ignore
      return DoubleSidedCardUtils;
    case CardType.Undefined:
      // @ts-ignore
      return UndefinedCardUtils;
  }
  // @ts-ignore
  return NormalCardUtils;
}

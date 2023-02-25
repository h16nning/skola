import { ReactNode } from "react";
import { Card, CardType, createCardSkeleton } from "./card";

export interface CardTypeManager<T extends CardType> {
  create(...{}): Card<T>;

  displayQuestion(card: Card<T>): ReactNode;

  displayAnswer(card: Card<T>): ReactNode;
}

export const NormalCardManager: CardTypeManager<CardType.Normal> = {
  create: (front: string, back: string) => {
    return {
      ...createCardSkeleton(),
      content: { type: CardType.Normal, front: front, back: back },
    };
  },
  displayQuestion: (card: Card<CardType.Normal>) => card.content.front,
  displayAnswer: (card: Card<CardType.Normal>) => card.content.back,
};

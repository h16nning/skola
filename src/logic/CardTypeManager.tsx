import { ReactNode } from "react";
import { Card, CardType, createCardSkeleton } from "./card";

export interface CardTypeManager<T extends CardType> {
  create: (params: any) => Card<T>;

  update: (params: any, existingCard: Card<T>) => Card<T>;

  displayQuestion(card: Card<T>): ReactNode;
  displayAnswer(card: Card<T>): ReactNode;
}

export const NormalCardUtils: CardTypeManager<CardType.Normal> = {
  update(
    params: { front: string; back: string },
    existingCard: Card<CardType.Normal>
  ) {
    return {
      ...existingCard,
      content: {
        type: existingCard.content.type,
        front: params.front,
        back: params.back,
      },
    };
  },

  create(params: { front: string; back: string }): Card<CardType.Normal> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      },
    };
  },

  displayQuestion(card: Card<CardType.Normal>) {
    return <div dangerouslySetInnerHTML={{ __html: card.content.front }}></div>;
  },
  displayAnswer(card: Card<CardType.Normal>) {
    return <div dangerouslySetInnerHTML={{ __html: card.content.back }}></div>;
  },
};

export const ClozeCardUtils: CardTypeManager<CardType.Cloze> = {
  update(
    params: { front: string; clozeCards: [] },
    existingCard: Card<CardType.Cloze>
  ) {
    return {
      ...existingCard,
      content: {
        type: existingCard.content.type,
        front: params.front,
        clozeCards: [],
      },
    };
  },

  create(params: { front: string; clozeCards: [] }): Card<CardType.Cloze> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Cloze,
        front: params.front,
        clozeCards: [],
      },
    };
  },

  displayQuestion(card: Card<CardType.Cloze>) {
    return card.content.front;
  },
  displayAnswer(card: Card<CardType.Cloze>) {
    return card.content.front;
  },
};

export function getUtils<T extends CardType>(card: Card<T>) {
  switch (card.content.type) {
    case CardType.Normal:
      return NormalCardUtils;
    case CardType.Cloze:
      return ClozeCardUtils;
  }
  return NormalCardUtils;
}

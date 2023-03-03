import { ReactNode } from "react";
import { Card, CardType, createCardSkeleton } from "./card";

export interface CardTypeManager<T extends CardType> {
  create: (params: any) => Card<T>;

  update: (params: any, existingCard: Card<T>) => Card<T>;

  displayQuestion(card: Card<T>): ReactNode;
  displayAnswer(card: Card<T>): ReactNode;
}

class NormalCardManager implements CardTypeManager<CardType.Normal> {
  public update(
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
  }

  public create(params: {
    front: string;
    back: string;
  }): Card<CardType.Normal> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      },
    };
  }

  public displayQuestion(card: Card<CardType.Normal>) {
    return card.content.front;
  }
  public displayAnswer(card: Card<CardType.Normal>) {
    return card.content.back;
  }
}

export const NormalCardUtils = new NormalCardManager();

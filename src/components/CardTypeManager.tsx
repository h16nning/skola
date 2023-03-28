import React, { ReactNode } from "react";
import { Card, CardType, createCardSkeleton } from "../logic/card";
import { Divider, Stack, Title } from "@mantine/core";
import NormalCardEditor from "./editcard/NormalCardEditor";
import ClozeCardEditor from "./editcard/ClozeCardEditor";
import { Deck } from "../logic/deck";
import { swapMono } from "../logic/ui";

export interface CardTypeManager<T extends CardType> {
  create: (params: any) => Card<T>;

  update: (params: any, existingCard: Card<T>) => Card<T>;

  displayQuestion(card: Card<T>): ReactNode;

  displayAnswer(card: Card<T>): ReactNode;

  editor(card: Card<CardType> | null, deck: Deck, mode: EditMode): JSX.Element;
}

export type EditMode = "edit" | "new";

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
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{ __html: card.content.front }}
      ></Title>
    );
  },

  displayAnswer(card: Card<CardType.Normal>) {
    return (
      <Stack spacing="xl">
        {NormalCardUtils.displayQuestion(card)}
        <Divider sx={(theme) => ({ borderColor: swapMono(theme, 2, 6) })} />
        <div dangerouslySetInnerHTML={{ __html: card.content.back }}></div>
      </Stack>
    );
  },

  editor(card: Card<CardType.Normal> | null, deck: Deck, mode: EditMode) {
    return <NormalCardEditor card={card} deck={deck} mode={mode} />;
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
  editor(card: Card<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor card={card} deck={deck} mode={mode} />;
  },
};

export function getUtils(cardType: CardType) {
  switch (cardType) {
    case CardType.Normal:
      return NormalCardUtils;
    case CardType.Cloze:
      return ClozeCardUtils;
  }
  return NormalCardUtils;
}

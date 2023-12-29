import { Card, CardType, createCardSkeleton } from "../card";
import { Deck } from "../deck";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
import React from "react";
import { CardTypeManager, EditMode } from "../CardTypeManager";

export type ClozeContent = {
  occlusionId: string;
};

export const ClozeCardUtils: CardTypeManager<CardType.Cloze> = {
  update(params: {}, existingCard: Card<CardType.Cloze>) {
    return {
      ...existingCard,
      content: {
        type: existingCard.content.type,
        occlusionId: " params.occlusionId",
      },
    };
  },

  create(params: { front: string; occlusionId: string }): Card<CardType.Cloze> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Cloze,
        occlusionId: "params.occlusionId",
      },
    };
  },

  displayPreview(card: Card<CardType.Cloze>) {
    return "Cloze Card";
  },

  displayQuestion(card: Card<CardType.Cloze>) {
    return "card.content.front;";
  },
  displayAnswer(card: Card<CardType.Cloze>) {
    return "card.content.front;";
  },
  editor(card: Card<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor card={card} deck={deck} mode={mode} />;
  },
};

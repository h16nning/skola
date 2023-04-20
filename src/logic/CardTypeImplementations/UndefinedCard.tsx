import { CardTypeManager, EditMode } from "../CardTypeManager";
import { Card, CardType, createCardSkeleton } from "../card";
import { Deck } from "../deck";
import React from "react";

export const UndefinedCardUtils: CardTypeManager<CardType.Undefined> = {
  update(params: {}, existingCard: Card<CardType.Undefined>) {
    return {
      ...existingCard,
      content: {
        type: existingCard.content.type,
      },
    };
  },

  create(): Card<CardType.Undefined> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Undefined,
      },
    };
  },

  displayPreview() {
    return "Undefined Card Preview";
  },

  displayQuestion() {
    return "Undefined Card Question";
  },

  displayAnswer() {
    return "Undefined Card Answer";
  },

  editor() {
    return <span>Undefined Card Editor</span>;
  },
};

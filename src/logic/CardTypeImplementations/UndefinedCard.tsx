import { CardTypeManager } from "../CardTypeManager";
import { Card, CardType, createCardSkeleton } from "../card";
import React from "react";

export const UndefinedCardUtils: CardTypeManager<CardType.Undefined> = {
  update(_, existingCard: Card<CardType.Undefined>) {
    return {
      ...existingCard,
      content: {
        preview: "[Undefined Card]",
        type: existingCard.content.type,
      },
    };
  },

  create(): Card<CardType.Undefined> {
    return {
      ...createCardSkeleton(),
      preview: "[Undefined Card]",
      content: {
        type: CardType.Undefined,
      },
    };
  },

  displayQuestion() {
    return "[Undefined Card] Question";
  },

  displayAnswer() {
    return "[Undefined Card] Answer";
  },

  editor() {
    return <span>Undefined Card Editor</span>;
  },

  delete() {
    console.warn("tried to delete card of type undefined. Not possible.");
  },
};

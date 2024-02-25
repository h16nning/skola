import { CardTypeManager } from "../CardTypeManager";
import { Card, CardType, createCardSkeleton } from "../card";
import React from "react";

export const UndefinedCardUtils: CardTypeManager<CardType.Undefined> = {
  updateCard(_, existingCard: Card<CardType.Undefined>) {
    return {
      ...existingCard,
      content: {
        preview: "[Undefined Card]",
        type: existingCard.content.type,
      },
    };
  },

  createCard(): Card<CardType.Undefined> {
    return {
      ...createCardSkeleton(),
      preview: "[Undefined Card]",
      note: "-1",
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

  deleteCard() {
    console.warn("tried to delete card of type undefined. Not possible.");
  },
};

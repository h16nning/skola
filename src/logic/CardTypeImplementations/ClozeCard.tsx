import { Card, CardType, createCardSkeleton, updateCard } from "../card";
import { Deck } from "../deck";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
import React from "react";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  createSharedValue,
  getSharedValue,
  setSharedValue,
} from "../sharedvalue";

export type ClozeContent = {
  occlusionNumber: number;
  textReferenceId: string;
};

export const ClozeCardUtils: CardTypeManager<CardType.Cloze> = {
  update(params: { text: string }, existingCard: Card<CardType.Cloze>) {
    setSharedValue(existingCard.content.textReferenceId, params.text);
    updateCard(existingCard.id, existingCard);
    return existingCard;
  },

  create(params: {
    occlusionNumber: number;
    textReferenceId: string;
  }): Card<CardType.Cloze> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.Cloze,
        occlusionNumber: params.occlusionNumber,
        textReferenceId: params.textReferenceId,
      },
    };
  },

  displayPreview(card: Card<CardType.Cloze>) {
    return getSharedValue(card.content.textReferenceId)
      .then(
        (sharedValue) =>
          "[" +
            card.content.occlusionNumber +
            "] " +
            sharedValue?.value.replace(/<[^>]*>/g, "") ?? "error"
      )
      .catch(() => "error");
  },

  displayQuestion(card: Card<CardType.Cloze>) {
    return "Cloze Card Occluded";
  },
  displayAnswer(card: Card<CardType.Cloze>) {
    return "Cloze Card Answer";
  },
  editor(card: Card<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor card={card} deck={deck} mode={mode} />;
  },
};

export async function createClozeCardSet(params: {
  text: string;
  occlusionNumberSet: number[];
}): Promise<Card<CardType.Cloze>[]> {
  const textReferenceId = await createSharedValue(params.text);
  return params.occlusionNumberSet.map((occlusionNumber) =>
    ClozeCardUtils.create({
      occlusionNumber: occlusionNumber,
      textReferenceId: textReferenceId,
    })
  );
}

import React from "react";
import { Text } from "@mantine/core";
import { Card, CardType, createCardSkeleton, updateCard } from "../card";
import { Deck } from "../deck";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  createSharedValue,
  getSharedValue,
  setSharedValue,
  useSharedValue,
} from "../sharedvalue";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
import classes from "./ClozeCard.module.css";

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
          `[${card.content.occlusionNumber}]${sharedValue?.value.replace(
            /<[^>]*>/g,
            ""
          )}`
      )
      .catch(() => "error");
  },

  displayQuestion(card: Card<CardType.Cloze>) {
    return <ClozeCardComponent occluded={true} card={card} />;
  },
  displayAnswer(card: Card<CardType.Cloze>) {
    return <ClozeCardComponent occluded={false} card={card} />;
  },
  displayInNotebook(card: Card<CardType.Cloze>) {
    return <ClozeCardComponent occluded={false} card={card} />;
  },
  editor(card: Card<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor card={card} deck={deck} mode={mode} />;
  },
};

function ClozeCardComponent({
  occluded,
  card,
}: { occluded: boolean; card: Card<CardType.Cloze> }) {
  const sharedValue = useSharedValue(card.content.textReferenceId);
  let finalText = sharedValue?.value ?? "";
  finalText = finalText.replace(
    new RegExp(`{{c${card.content.occlusionNumber}::((?!{{|}}).)*}}`, "g"),
    (match) =>
      `<span class="cloze-field"><span class="cloze-content ${
        occluded && "occluded"
      }">${match}</span></span>`
  );
  finalText = finalText.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
    match.slice(6, -2)
  );
  return (
    <Text
      dangerouslySetInnerHTML={{ __html: finalText }}
      className={classes.clozeCard}
    />
  );
}

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

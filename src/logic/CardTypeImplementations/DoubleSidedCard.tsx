import common from "../../style/CommonStyles.module.css";
import { Card, CardType, createCardSkeleton, updateCard } from "../card";
import { Deck } from "../deck";
import React from "react";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  createSharedValue,
  getSharedValue,
  registerReferencesToSharedValue,
  setSharedValue,
  useSharedValue,
} from "../sharedvalue";
import DoubleSidedCardEditor from "../../components/editcard/CardEditor/DoubleSidedCardEditor";
import { Divider, Stack, Title } from "@mantine/core";

export type DoubleSidedContent = {
  frontReferenceId: string;
  backReferenceId: string;
};
export const DoubleSidedCardUtils: CardTypeManager<CardType.DoubleSided> = {
  update(
    params: { front: string; back: string },
    existingCard: Card<CardType.DoubleSided>
  ) {
    setSharedValue(existingCard.content.frontReferenceId, params.front);
    setSharedValue(existingCard.content.backReferenceId, params.back);
    updateCard(existingCard.id, existingCard);
    return existingCard;
  },

  create(params: {
    frontReferenceId: string;
    backReferenceId: string;
  }): Card<CardType.DoubleSided> {
    return {
      ...createCardSkeleton(),
      content: {
        type: CardType.DoubleSided,
        frontReferenceId: params.frontReferenceId ?? "error",
        backReferenceId: params.backReferenceId ?? "error",
      },
    };
  },
  displayPreview(card: Card<CardType.DoubleSided>) {
    return getSharedValue(card.content.frontReferenceId)
      .then((front) => front?.value.replace(/<[^>]*>/g, "") ?? "error")
      .catch(() => "error");
  },

  displayQuestion(card: Card<CardType.DoubleSided>) {
    function FrontComponent() {
      const front = useSharedValue(card.content.frontReferenceId);
      return (
        <Title
          order={3}
          fw={600}
          dangerouslySetInnerHTML={{ __html: front?.value ?? "&#8203;" }}
        ></Title>
      );
    }
    return <FrontComponent />;
  },

  displayAnswer(card: Card<CardType.DoubleSided>) {
    function BackComponent() {
      const back = useSharedValue(card.content.backReferenceId);
      return (
        <span
          dangerouslySetInnerHTML={{ __html: back?.value ?? "&#8203;" }}
        ></span>
      );
    }
    return (
      <Stack gap="xl">
        {DoubleSidedCardUtils.displayQuestion(card)}
        <Divider className={common.lightBorder} />
        <BackComponent />
      </Stack>
    );
  },

  editor(card: Card<CardType.DoubleSided> | null, deck: Deck, mode: EditMode) {
    return <DoubleSidedCardEditor card={card} deck={deck} mode={mode} />;
  },
};

export async function createDoubleSidedCardPair(params: {
  value1: string;
  value2: string;
}): Promise<[Card<CardType.DoubleSided>, Card<CardType.DoubleSided>]> {
  const [referenceId1, referenceId2] = await Promise.all([
    createSharedValue(params.value1),
    createSharedValue(params.value2),
  ]);
  const card1 = DoubleSidedCardUtils.create({
    frontReferenceId: referenceId1,
    backReferenceId: referenceId2,
  });
  const card2 = DoubleSidedCardUtils.create({
    frontReferenceId: referenceId2,
    backReferenceId: referenceId1,
  });
  await Promise.all([
    registerReferencesToSharedValue(referenceId1, [card1.id, card2.id]),
    registerReferencesToSharedValue(referenceId2, [card1.id, card2.id]),
  ]);
  return [card1, card2];
}

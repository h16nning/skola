import { Divider, Stack, Title } from "@mantine/core";
import DoubleSidedCardEditor from "../../components/editcard/CardEditor/DoubleSidedCardEditor";
import common from "../../style/CommonStyles.module.css";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  deleteCard,
  toPreviewString,
  updateCard,
} from "../card";
import { Deck } from "../deck";
import {
  createSharedValue,
  registerReferencesToSharedValue,
  removeReferenceToSharedValue,
  setSharedValue,
  useSharedValue,
} from "../sharedvalue";
import { db } from "../db";

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
    updateCard(existingCard.id, {
      preview: toPreviewString(params.front),
    });
    return { preview: toPreviewString(params.front), ...existingCard };
  },

  create(params: {
    frontReferenceId: string;
    backReferenceId: string;
    front: string;
  }): Card<CardType.DoubleSided> {
    return {
      ...createCardSkeleton(),
      preview: toPreviewString(params.front),
      content: {
        type: CardType.DoubleSided,
        frontReferenceId: params.frontReferenceId ?? "error",
        backReferenceId: params.backReferenceId ?? "error",
      },
    };
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

  displayInNotebook(card: Card<CardType.DoubleSided>) {
    function FrontComponent() {
      const front = useSharedValue(card.content.frontReferenceId);
      return (
        <Title
          order={3}
          dangerouslySetInnerHTML={{ __html: front?.value ?? "&#8203;" }}
        ></Title>
      );
    }
    function BackComponent() {
      const back = useSharedValue(card.content.backReferenceId);
      return (
        <span
          dangerouslySetInnerHTML={{ __html: back?.value ?? "&#8203;" }}
        ></span>
      );
    }
    return (
      <Stack gap="sm">
        <FrontComponent />
        <BackComponent />
      </Stack>
    );
  },

  editor(card: Card<CardType.DoubleSided> | null, deck: Deck, mode: EditMode) {
    return <DoubleSidedCardEditor card={card} deck={deck} mode={mode} />;
  },

  async delete(card: Card<CardType.DoubleSided>) {
    db.transaction("rw", db.decks, db.cards, db.sharedvalues, async () => {
      await Promise.all([
        removeReferenceToSharedValue(card.content.frontReferenceId, card.id),
        removeReferenceToSharedValue(card.content.backReferenceId, card.id),
      ]);
      await deleteCard(card);
    });
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
    front: params.value1,
  });
  const card2 = DoubleSidedCardUtils.create({
    frontReferenceId: referenceId2,
    backReferenceId: referenceId1,
    front: params.value2,
  });
  await Promise.all([
    registerReferencesToSharedValue(referenceId1, [card1.id, card2.id]),
    registerReferencesToSharedValue(referenceId2, [card1.id, card2.id]),
  ]);
  return [card1, card2];
}

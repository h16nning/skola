import { Divider, Stack, Title } from "@mantine/core";
import NormalCardEditor from "../../components/editcard/CardEditor/NormalCardEditor";
import common from "../../style/CommonStyles.module.css";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  deleteCard,
  toPreviewString,
} from "../card";
import { Deck } from "../deck";

export type NormalContent = {
  front: string;
  back: string;
};

export const NormalCardUtils: CardTypeManager<CardType.Normal> = {
  update(
    params: { front: string; back: string },
    existingCard: Card<CardType.Normal>
  ) {
    return {
      ...existingCard,
      preview: toPreviewString(params.front),
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
      preview: toPreviewString(params.front),
      content: {
        type: CardType.Normal,
        front: params.front ?? "error",
        back: params.back ?? "error",
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

  displayAnswer(card: Card<CardType.Normal>, place: "learn" | "notebook") {
    return (
      <Stack gap={place === "notebook" ? "sm" : "lg"} w="100%">
        {NormalCardUtils.displayQuestion(card)}
        <Divider className={common.lightBorderColor} />
        <div dangerouslySetInnerHTML={{ __html: card.content.back }}></div>
      </Stack>
    );
  },

  editor(card: Card<CardType.Normal> | null, deck: Deck, mode: EditMode) {
    return <NormalCardEditor card={card} deck={deck} mode={mode} />;
  },

  async delete(card: Card<CardType.Normal>) {
    deleteCard(card);
  },
};

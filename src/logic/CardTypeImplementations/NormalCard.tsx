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
import { NormalNoteContent, newNote, updateNote, useNote } from "../note";
import { Deck } from "../deck";

export type NormalContent = {};

export const NormalCardUtils: CardTypeManager<CardType.Normal> = {
  updateCard(
    params: { front: string; back: string },
    existingCard: Card<CardType.Normal>
  ) {
    updateNote(existingCard.note, {
      type: CardType.Normal,
      front: params.front,
      back: params.back,
    });
    return {
      ...existingCard,
      preview: toPreviewString(params.front),
    };
  },

  createCard(params: { noteId: string; front: string }): Card<CardType.Normal> {
    return {
      ...createCardSkeleton(),
      preview: toPreviewString(params.front),
      note: params.noteId,
      content: { type: CardType.Normal },
    };
  },

  displayQuestion(card: Card<CardType.Normal>) {
    const noteContent =
      (useNote(card.note)?.content as NormalNoteContent) ?? {};
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{ __html: noteContent.front }}
      ></Title>
    );
  },

  displayAnswer(card: Card<CardType.Normal>, place: "learn" | "notebook") {
    const noteContent =
      (useNote(card.note)?.content as NormalNoteContent) ?? {};
    return (
      <Stack gap={place === "notebook" ? "sm" : "lg"} w="100%">
        {NormalCardUtils.displayQuestion(card)}
        <Divider className={common.lightBorderColor} />
        <div dangerouslySetInnerHTML={{ __html: noteContent.back }}></div>
      </Stack>
    );
  },

  editor(card: Card<CardType.Normal> | null, deck: Deck, mode: EditMode) {
    return <NormalCardEditor card={card} deck={deck} mode={mode} />;
  },

  async deleteCard(card: Card<CardType.Normal>) {
    deleteCard(card);
  },
};

export async function createNormalCard(front: string, back: string) {
  const noteId = await newNote({
    type: CardType.Normal,
    front: front,
    back: back,
  });
  return NormalCardUtils.createCard({ noteId: noteId, front });
}

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
import { NoteContent, newNote, updateNote } from "../note";

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

  displayQuestion(
    _: Card<CardType.Normal>,
    content?: NoteContent<CardType.Normal>
  ) {
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{ __html: content?.front ?? "" }}
      ></Title>
    );
  },

  displayAnswer(
    card: Card<CardType.Normal>,
    content?: NoteContent<CardType.Normal>,
    place?: "learn" | "notebook"
  ) {
    return (
      <Stack gap={place === "notebook" ? "sm" : "lg"} w="100%">
        {NormalCardUtils.displayQuestion(card, content)}
        <Divider className={common.lightBorderColor} />
        <div dangerouslySetInnerHTML={{ __html: content?.back ?? "" }}></div>
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

export async function createNormalCard(
  deckId: string,
  front: string,
  back: string
) {
  const noteId = await newNote(deckId, {
    type: CardType.Normal,
    front: front,
    back: back,
  });
  return NormalCardUtils.createCard({ noteId: noteId, front });
}

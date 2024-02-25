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
import { db } from "../db";
import { Deck } from "../deck";
import {
  NoteContent,
  newNote,
  registerReferencesToNote,
  removeReferenceToNote,
  updateNote,
} from "../note";

export type DoubleSidedContent = {
  frontIsField1: boolean;
};

export const DoubleSidedCardUtils: CardTypeManager<CardType.DoubleSided> = {
  updateCard(
    params: { front: string; back: string },
    existingCard: Card<CardType.DoubleSided>
  ) {
    updateNote(existingCard.note, {
      type: CardType.DoubleSided,
      field1: existingCard.content.frontIsField1 ? params.front : params.back,
      field2: existingCard.content.frontIsField1 ? params.back : params.front,
    });
    console.log(existingCard.id);
    updateCard(existingCard.id, {
      preview: toPreviewString(params.front),
    });
    return { preview: toPreviewString(params.front), ...existingCard };
  },

  createCard(params: {
    noteId: string;
    frontIsField1: boolean;
    front: string;
  }): Card<CardType.DoubleSided> {
    return {
      ...createCardSkeleton(),
      note: params.noteId,
      preview: toPreviewString(params.front),
      content: {
        type: CardType.DoubleSided,
        frontIsField1: params.frontIsField1,
      },
    };
  },

  displayQuestion(
    card: Card<CardType.DoubleSided>,
    content?: NoteContent<CardType.DoubleSided>
  ) {
    function FrontComponent() {
      return (
        <Title
          order={3}
          fw={600}
          dangerouslySetInnerHTML={{
            __html:
              (card.content.frontIsField1
                ? content?.field1
                : content?.field2) ?? "error",
          }}
        ></Title>
      );
    }
    return <FrontComponent />;
  },

  displayAnswer(
    card: Card<CardType.DoubleSided>,
    content?: NoteContent<CardType.DoubleSided>,
    place?: "learn" | "notebook"
  ) {
    function BackComponent() {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html:
              (card.content.frontIsField1
                ? content?.field2
                : content?.field1) ?? "error",
          }}
        ></span>
      );
    }
    return (
      <Stack gap={place === "notebook" ? "sm" : "lg"} w="100%">
        {DoubleSidedCardUtils.displayQuestion(card, content)}
        <Divider className={common.lightBorderColor} />
        <BackComponent />
      </Stack>
    );
  },

  editor(card: Card<CardType.DoubleSided> | null, deck: Deck, mode: EditMode) {
    return <DoubleSidedCardEditor card={card} deck={deck} mode={mode} />;
  },

  async deleteCard(card: Card<CardType.DoubleSided>) {
    db.transaction("rw", db.decks, db.cards, db.notes, async () => {
      await removeReferenceToNote(card.note, card.id);
      await deleteCard(card);
    });
  },
};

export async function createDoubleSidedCardPair(params: {
  value1: string;
  value2: string;
}) {
  const noteId = await newNote({
    type: CardType.DoubleSided,
    field1: params.value1,
    field2: params.value2,
  });
  const card1 = DoubleSidedCardUtils.createCard({
    noteId: noteId,
    frontIsField1: true,
    front: params.value1,
  });
  const card2 = DoubleSidedCardUtils.createCard({
    noteId: noteId,
    frontIsField1: false,
    front: params.value2,
  });
  await registerReferencesToNote(noteId, [card1.id, card2.id]);
  console.log(card1, card2);
  return [card1, card2];
}

import { Divider, Stack, Title } from "@mantine/core";
import DoubleSidedCardEditor from "../../components/editcard/CardEditor/DoubleSidedCardEditor";
import common from "../../style/CommonStyles.module.css";
import { EditMode, TypeManager } from "../TypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  deleteCard,
  newCard,
  toPreviewString,
} from "../card";
import { db } from "../db";
import { Deck } from "../deck";
import { Note, NoteContent, newNote, updateNoteContent } from "../note";

export type DoubleSidedContent = {
  frontIsField1: boolean;
};

export const DoubleSidedCardUtils: TypeManager<CardType.DoubleSided> = {
  async createNote(params: { field1: string; field2: string }, deck: Deck) {
    function createDoubleSidedCard(
      noteId: string,
      frontIsField1: boolean,
      front: string
    ) {
      return {
        ...createCardSkeleton(),
        note: noteId,
        preview: toPreviewString(front),
        content: {
          type: CardType.DoubleSided,
          frontIsField1: frontIsField1,
        },
      };
    }
    return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
      const noteId = await newNote(deck, {
        type: CardType.DoubleSided,
        field1: params.field1,
        field2: params.field2,
      });
      await newCard(createDoubleSidedCard(noteId, true, params.field1), deck);
      await newCard(createDoubleSidedCard(noteId, false, params.field2), deck);
    });
  },

  async updateNote(
    params: { field1: string; field2: string },
    existingNote: Note<CardType.DoubleSided>
  ) {
    return db.transaction("rw", db.notes, db.cards, async () => {
      await updateNoteContent(existingNote.id, {
        type: CardType.DoubleSided,
        field1: params.field1,
        field2: params.field2,
      });
    });
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

  displayNote(
    note: Note<CardType.DoubleSided>,
    showAllAnswers: "strict" | "facultative" | "none"
  ) {
    return (
      <Stack gap="sm" w="100%">
        <Title
          order={3}
          fw={600}
          dangerouslySetInnerHTML={{ __html: note.content.field1 ?? "" }}
        />
        {showAllAnswers !== "none" && (
          <>
            <Divider className={common.lightBorderColor} />
            <div
              dangerouslySetInnerHTML={{ __html: note.content.field2 ?? "" }}
            />
          </>
        )}
      </Stack>
    );
  },

  getSortFieldFromNoteContent(content) {
    return toPreviewString(content.field1);
  },

  editor(
    note: Note<CardType.DoubleSided> | null,
    deck: Deck,
    mode: EditMode,
    onChanged?: () => void
  ) {
    return (
      <DoubleSidedCardEditor
        note={note}
        deck={deck}
        mode={mode}
        onChanged={onChanged}
      />
    );
  },

  //DEPRECATED
  async deleteCard(card: Card<CardType.DoubleSided>) {
    db.transaction("rw", db.decks, db.cards, db.notes, async () => {
      await deleteCard(card);
    });
  },
};

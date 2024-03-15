import { Divider, Stack, Title } from "@mantine/core";
import { useState } from "react";
import NormalCardEditor from "../../components/editcard/CardEditor/NormalCardEditor";
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

export type NormalContent = {};

export const NormalCardUtils: TypeManager<CardType.Normal> = {
  async createNote(params: { front: string; back: string }, deck: Deck) {
    return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
      const noteId = await newNote(deck, {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      });
      await newCard(
        {
          ...createCardSkeleton(),
          note: noteId,
          content: { type: CardType.Normal },
        },
        deck
      );
    });
  },

  async updateNote(
    params: { front: string; back: string },
    existingNote: Note<CardType.Normal>
  ) {
    return db.transaction("rw", db.notes, db.cards, async () => {
      await updateNoteContent(existingNote.id, {
        type: CardType.Normal,
        front: params.front,
        back: params.back,
      });
    });
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

  displayNote(
    note: Note<CardType.Normal>,
    showAllAnswers: "strict" | "facultative" | "none"
  ) {
    const [individualShowAnswer, setIndividualShowAnswer] = useState(false);

    return (
      <Stack
        gap="sm"
        w="100%"
        onClick={() => setIndividualShowAnswer(!individualShowAnswer)}
      >
        <Title
          order={3}
          fw={600}
          dangerouslySetInnerHTML={{ __html: note.content?.front ?? "" }}
        />
        {showAllAnswers !== "none" && (
          <>
            <Divider className={common.lightBorderColor} />
            <div
              dangerouslySetInnerHTML={{ __html: note.content?.back ?? "" }}
            />
          </>
        )}
      </Stack>
    );
  },

  getSortFieldFromNoteContent(content?: NoteContent<CardType.Normal>) {
    return toPreviewString(content?.front ?? "[error]");
  },

  editor(
    note: Note<CardType.Normal> | null,
    deck: Deck,
    mode: EditMode,
    requestedFinish: boolean,
    setRequestedFinish: (finish: boolean) => void
  ) {
    return (
      <NormalCardEditor
        note={note}
        deck={deck}
        mode={mode}
        requestedFinish={requestedFinish}
        setRequestedFinish={setRequestedFinish}
      />
    );
  },

  async deleteCard(card: Card<CardType.Normal>) {
    deleteCard(card);
  },
};

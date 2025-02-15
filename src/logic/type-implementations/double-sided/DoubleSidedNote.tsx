import DoubleSidedCardEditor from "@/app/editor/NoteEditor/DoubleSidedCardEditor";
import { NoteEditorProps, NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { Card, HTMLtoPreviewString } from "@/logic/card/card";
import { createCardSkeleton } from "@/logic/card/createCardSkeleton";
import { deleteCard } from "@/logic/card/deleteCard";
import { newCard } from "@/logic/card/newCard";
import { db } from "@/logic/db";
import { Deck } from "@/logic/deck/deck";
import { NoteContent } from "@/logic/note/NoteContent";
import { newNote } from "@/logic/note/newNote";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { updateNoteContent } from "@/logic/note/updateNoteContent";
import common from "@/style/CommonStyles.module.css";
import { Divider, Stack, Title } from "@mantine/core";

export const DoubleSidedNoteTypeAdapter: NoteTypeAdapter<NoteType.DoubleSided> =
  {
    async createNote(params: { field1: string; field2: string }, deck: Deck) {
      function createDoubleSidedCard(
        noteId: string,
        frontIsField1: boolean,
        front: string
      ) {
        return {
          ...createCardSkeleton(),
          note: noteId,
          preview: HTMLtoPreviewString(front),
          content: {
            type: NoteType.DoubleSided,
            frontIsField1: frontIsField1,
          },
        };
      }
      return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
        const noteId = await newNote(deck, {
          type: NoteType.DoubleSided,
          field1: params.field1,
          field2: params.field2,
        });
        await newCard(createDoubleSidedCard(noteId, true, params.field1), deck);
        await newCard(
          createDoubleSidedCard(noteId, false, params.field2),
          deck
        );
      });
    },

    async updateNote(
      params: { field1: string; field2: string },
      existingNote: Note<NoteType.DoubleSided>
    ) {
      return db.transaction("rw", db.notes, db.cards, async () => {
        await updateNoteContent(existingNote.id, {
          type: NoteType.DoubleSided,
          field1: params.field1,
          field2: params.field2,
        });
      });
    },

    displayQuestion(
      card: Card<NoteType.DoubleSided>,
      content?: NoteContent<NoteType.DoubleSided>
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
      card: Card<NoteType.DoubleSided>,
      content?: NoteContent<NoteType.DoubleSided>,
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
          {DoubleSidedNoteTypeAdapter.displayQuestion(card, content)}
          <Divider className={common.lightBorderColor} />
          <BackComponent />
        </Stack>
      );
    },

    displayNote(
      note: Note<NoteType.DoubleSided>,
      showAllAnswers: "strict" | "optional" | "none"
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
      return HTMLtoPreviewString(content.field1);
    },

    editor({
      note,
      deck,
      mode,
      requestedFinish,
      setRequestedFinish,
      focusSelectNoteType,
    }: NoteEditorProps) {
      return (
        <DoubleSidedCardEditor
          note={note as Note<NoteType.DoubleSided> | null}
          deck={deck}
          mode={mode}
          requestedFinish={requestedFinish}
          setRequestedFinish={setRequestedFinish}
          focusSelectNoteType={focusSelectNoteType}
        />
      );
    },

    //DEPRECATED
    async deleteCard(card: Card<NoteType.DoubleSided>) {
      db.transaction("rw", db.decks, db.cards, db.notes, async () => {
        await deleteCard(card);
      });
    },
  };

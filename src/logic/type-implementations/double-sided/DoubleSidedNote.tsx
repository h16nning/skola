import DoubleSidedCardEditor from "@/app/editor/NoteEditor/DoubleSidedCardEditor";
import { NoteEditorProps, NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { Card, HTMLtoPreviewString } from "@/logic/card/card";
import { deleteCard } from "@/logic/card/deleteCard";
import { db } from "@/logic/db";
import { NoteContent } from "@/logic/note/NoteContent";
import { Note, NoteType } from "@/logic/note/note";
import {
  NoteDisplay,
  QuestionOnly,
  QuestionWithAnswer,
} from "../shared/QuestionAnswerDisplay";
import createDoubleSidedNote from "./createDoubleSidedNote";
import { updateDoubleSidedNote } from "./updateDoubleSidedNote";

export const DoubleSidedNoteTypeAdapter: NoteTypeAdapter<NoteType.DoubleSided> =
  {
    createNote: createDoubleSidedNote,

    updateNote: updateDoubleSidedNote,

    displayQuestion(
      card: Card<NoteType.DoubleSided>,
      content?: NoteContent<NoteType.DoubleSided>
    ) {
      const frontHtml = card.content.frontIsField1
        ? content?.field1
        : content?.field2;
      return <QuestionOnly html={frontHtml ?? "error"} />;
    },

    displayAnswer(
      card: Card<NoteType.DoubleSided>,
      content?: NoteContent<NoteType.DoubleSided>,
      _place?: "learn" | "notebook"
    ) {
      const frontHtml = card.content.frontIsField1
        ? content?.field1
        : content?.field2;
      const backHtml = card.content.frontIsField1
        ? content?.field2
        : content?.field1;
      return (
        <QuestionWithAnswer
          questionHtml={frontHtml ?? "error"}
          answerHtml={backHtml ?? "error"}
        />
      );
    },

    displayNote(
      note: Note<NoteType.DoubleSided>,
      showAllAnswers: "strict" | "optional" | "none"
    ) {
      return (
        <NoteDisplay
          questionHtml={note.content.field1 ?? ""}
          answerHtml={note.content.field2 ?? ""}
          showAnswer={showAllAnswers !== "none"}
        />
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

    async deleteCard(card: Card<NoteType.DoubleSided>) {
      db.transaction("rw", db.decks, db.cards, db.notes, async () => {
        await deleteCard(card);
      });
    },
  };

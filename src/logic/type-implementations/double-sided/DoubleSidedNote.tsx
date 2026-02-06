import DoubleSidedCardEditor from "@/app/editor/NoteEditor/DoubleSidedCardEditor";
import { Divider, Stack } from "@/components/ui";
import { NoteEditorProps, NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { Card, HTMLtoPreviewString } from "@/logic/card/card";
import { deleteCard } from "@/logic/card/deleteCard";
import { db } from "@/logic/db";
import { NoteContent } from "@/logic/note/NoteContent";
import { Note, NoteType } from "@/logic/note/note";
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
      function FrontComponent() {
        return (
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: 0,
            }}
            dangerouslySetInnerHTML={{
              __html:
                (card.content.frontIsField1
                  ? content?.field1
                  : content?.field2) ?? "error",
            }}
          />
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
        <Stack
          gap={place === "notebook" ? "sm" : "lg"}
          style={{ width: "100%" }}
        >
          {DoubleSidedNoteTypeAdapter.displayQuestion(card, content)}
          <Divider />
          <BackComponent />
        </Stack>
      );
    },

    displayNote(
      note: Note<NoteType.DoubleSided>,
      showAllAnswers: "strict" | "optional" | "none"
    ) {
      return (
        <Stack gap="sm" style={{ width: "100%" }}>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: note.content.field1 ?? "" }}
          />
          {showAllAnswers !== "none" && (
            <>
              <Divider />
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

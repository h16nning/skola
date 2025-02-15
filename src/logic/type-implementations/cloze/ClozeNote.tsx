import ClozeCardEditor from "@/app/editor/NoteEditor/ClozeCardEditor";
import { NoteEditorProps, NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { Card, HTMLtoPreviewString } from "@/logic/card/card";
import { createCardSkeleton } from "@/logic/card/createCardSkeleton";
import { deleteCard } from "@/logic/card/deleteCard";
import { newCard } from "@/logic/card/newCard";
import { db } from "@/logic/db";
import { Deck } from "@/logic/deck/deck";
import { NoteContent } from "@/logic/note/NoteContent";
import { getNote } from "@/logic/note/getNote";
import { newNote } from "@/logic/note/newNote";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { updateNoteContent } from "@/logic/note/updateNoteContent";
import { Text, UnstyledButton } from "@mantine/core";
import cx from "clsx";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { ReactNode, memo, useState } from "react";
import classes from "./ClozeNote.module.css";
import { ClozeNoteContent } from "./types";

export const ClozeNoteTypeAdapter: NoteTypeAdapter<NoteType.Cloze> = {
  createNote(
    params: { text: string; occlusionNumberSet: number[] },
    deck: Deck
  ): Promise<string | undefined> {
    function createClozeCard(
      noteId: string,
      occlusionNumber: number,
      _text: string
    ) {
      return {
        ...createCardSkeleton(),
        note: noteId,
        content: {
          type: NoteType.Cloze,
          occlusionNumber: occlusionNumber,
        },
      };
    }

    return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
      const noteId = await newNote(deck, {
        type: NoteType.Cloze,
        text: params.text,
      });
      await Promise.all(
        params.occlusionNumberSet.map(async (occlusionNumber) => {
          return await newCard(
            createClozeCard(noteId, occlusionNumber, params.text),
            deck
          );
        })
      );
      return noteId;
    });
  },

  updateNote(
    params: { text: string; occclusionNumberSet: number[] },
    existingNote: Note<NoteType.Cloze>
  ) {
    return db.transaction("rw", db.notes, db.cards, async () => {
      await updateNoteContent(existingNote.id, {
        type: NoteType.Cloze,
        text: params.text,
      });
      //might want to update occlusion numbers or delete cards if they are removed from the note?
    });
  },

  displayQuestion(
    card: Card<NoteType.Cloze>,
    content?: NoteContent<NoteType.Cloze>
  ) {
    return (
      <ClozeComponent
        content={content}
        activeCard={card}
        activeIsVisible={false}
        allAreVisible={true}
      />
    );
  },
  displayAnswer(
    card: Card<NoteType.Cloze>,
    content?: NoteContent<NoteType.Cloze>
  ) {
    return (
      <ClozeComponent
        content={content}
        activeCard={card}
        activeIsVisible={true}
        allAreVisible={true}
      />
    );
  },

  displayNote(
    note: Note<NoteType.Cloze>,
    showAllAnswers: "strict" | "optional" | "none"
  ) {
    return (
      <ClozeComponent
        content={note.content}
        allAreVisible={showAllAnswers === "strict" ? true : undefined}
      />
    );
  },

  getSortFieldFromNoteContent(content) {
    return HTMLtoPreviewString(
      content.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
        match.slice(6, -2)
      )
    );
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
      <ClozeCardEditor
        note={note as Note<NoteType.Cloze> | null}
        deck={deck}
        mode={mode}
        requestedFinish={requestedFinish}
        setRequestedFinish={setRequestedFinish}
        focusSelectNoteType={focusSelectNoteType}
      />
    );
  },

  //DEPRECATED
  async deleteCard(card: Card<NoteType.Cloze>) {
    db.transaction("rw", db.decks, db.cards, db.notes, async () => {
      const noteText = await getNote(card.note).then((n) =>
        n !== undefined ? (n.content as ClozeNoteContent).text : undefined
      );
      if (noteText !== undefined) {
        await updateNoteContent(card.note, {
          type: NoteType.Cloze,
          text: noteText.replace(
            new RegExp(
              `{{c${card.content.occlusionNumber}::((?!{{|}}).)*}}`,
              "g"
            ),
            (match) => match.slice(6, -2)
          ),
        });
      }
      await deleteCard(card);
    });
  },
};

const ClozeComponent = memo(
  ({
    activeCard,
    activeIsVisible,
    allAreVisible,
    content,
  }: {
    activeCard?: Card<NoteType.Cloze>;
    activeIsVisible?: boolean;
    allAreVisible?: boolean;
    content?: NoteContent<NoteType.Cloze>;
  }) => {
    let finalText = content?.text ?? "";
    if (activeCard) {
      finalText = finalText.replace(
        new RegExp(
          `{{c${activeCard.content.occlusionNumber}::((?!{{|}}).)*}}`,
          "g"
        ),
        (match) =>
          `<span class="interactive-cloze-field-replace active">${match.slice(
            6,
            -2
          )}</span>`
      );
    }
    finalText = finalText.replace(
      /\{\{c\d::((?!\{\{|}}).)*\}\}/g,
      (match) =>
        `<span class="interactive-cloze-field-replace">${match.slice(
          6,
          -2
        )}</span>`
    );

    console.log(finalText);
    const options: HTMLReactParserOptions = {
      replace(domNode) {
        if (
          domNode instanceof Element &&
          domNode.attribs.class &&
          domNode.attribs.class.includes("interactive-cloze-field-replace")
        ) {
          const isActive = domNode.attribs.class.endsWith("active");
          console.log(isActive);
          return (
            <ClozeField
              active={isActive}
              controlledIsVisible={isActive ? activeIsVisible : allAreVisible}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </ClozeField>
          );
        }
      },
    };

    return (
      <Text className={classes.clozeCard}>{parse(finalText, options)}</Text>
    );
  }
);

function ClozeField({
  children,
  controlledIsVisible,
  active,
}: { children: ReactNode; controlledIsVisible?: boolean; active?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <UnstyledButton
      className={cx({
        [classes.clozeField]: true,
        [classes.active]: active,
        [classes.interactive]: controlledIsVisible === undefined,
      })}
      onClick={() => setIsVisible(!isVisible)}
    >
      <span
        className={cx({
          [classes.occludable]: true,
          [classes.visible]:
            controlledIsVisible === undefined ? isVisible : controlledIsVisible,
        })}
      >
        {children}
      </span>
    </UnstyledButton>
  );
}

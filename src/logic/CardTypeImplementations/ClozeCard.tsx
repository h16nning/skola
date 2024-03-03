import { Text, UnstyledButton } from "@mantine/core";
import cx from "clsx";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { ReactNode, memo, useState } from "react";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
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
import {
  ClozeNoteContent,
  Note,
  NoteContent,
  getNote,
  newNote,
  updateNoteContent,
} from "../note";
import classes from "./ClozeCard.module.css";

export type ClozeContent = {
  occlusionNumber: number;
};

export const ClozeCardUtils: TypeManager<CardType.Cloze> = {
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
          type: CardType.Cloze,
          occlusionNumber: occlusionNumber,
        },
      };
    }

    return db.transaction("rw", db.notes, db.decks, db.cards, async () => {
      const noteId = await newNote(deck, {
        type: CardType.Cloze,
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
    existingNote: Note<CardType.Cloze>
  ) {
    return db.transaction("rw", db.notes, db.cards, async () => {
      await updateNoteContent(existingNote.id, {
        type: CardType.Cloze,
        text: params.text,
      });
      //might want to update occlusion numbers or delete cards if they are removed from the note?
    });
  },

  displayQuestion(
    card: Card<CardType.Cloze>,
    content?: NoteContent<CardType.Cloze>
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
    card: Card<CardType.Cloze>,
    content?: NoteContent<CardType.Cloze>
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
    note: Note<CardType.Cloze>,
    showAllAnswers: "strict" | "facultative" | "none"
  ) {
    return (
      <ClozeComponent
        content={note.content}
        allAreVisible={showAllAnswers === "strict" ? true : undefined}
      />
    );
  },

  getSortFieldFromNoteContent(content) {
    return toPreviewString(
      content.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
        match.slice(6, -2)
      )
    );
  },

  editor(
    note: Note<CardType.Cloze> | null,
    deck: Deck,
    mode: EditMode,
    onChanged?: () => void
  ) {
    return (
      <ClozeCardEditor
        note={note}
        deck={deck}
        mode={mode}
        onChanged={onChanged}
      />
    );
  },

  //DEPRECATED
  async deleteCard(card: Card<CardType.Cloze>) {
    db.transaction("rw", db.decks, db.cards, db.notes, async () => {
      const noteText = await getNote(card.note).then((n) =>
        n !== undefined ? (n.content as ClozeNoteContent).text : undefined
      );
      if (noteText !== undefined) {
        await updateNoteContent(card.note, {
          type: CardType.Cloze,
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
    activeCard?: Card<CardType.Cloze>;
    activeIsVisible?: boolean;
    allAreVisible?: boolean;
    content?: NoteContent<CardType.Cloze>;
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

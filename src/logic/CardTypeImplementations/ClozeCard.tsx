import { Text, UnstyledButton } from "@mantine/core";
import cx from "clsx";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { ReactNode, memo, useEffect, useState } from "react";
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
    return <ClozeCardComponent occluded={true} card={card} content={content} />;
  },
  displayAnswer(
    card: Card<CardType.Cloze>,
    content?: NoteContent<CardType.Cloze>
  ) {
    return (
      <ClozeCardComponent occluded={false} card={card} content={content} />
    );
  },

  displayNote(
    note: Note<CardType.Cloze>,
    showAllAnswers: "strict" | "facultative" | "none"
  ) {
    const [node, setNode] = useState<ReactNode | null>(null);

    useEffect(() => {
      let tempClozeCounter = 0;
      let finalText = note.content.text ?? "";
      finalText = finalText.replace(
        /\{\{c\d::((?!\{\{|}}).)*\}\}/g,
        (match) => {
          tempClozeCounter++;
          return `<span class="interactive-cloze-field-replace">${match.slice(
            6,
            -2
          )}</span></button>`;
        }
      );

      const options: HTMLReactParserOptions = {
        replace(domNode) {
          if (
            domNode instanceof Element &&
            domNode.attribs.class === "interactive-cloze-field-replace"
          ) {
            console.log("domNode");
            return (
              <ClozeField alwaysVisible={showAllAnswers === "strict"}>
                {domToReact(domNode.children as DOMNode[], options)}
              </ClozeField>
            );
          }
        },
      };
      setNode(
        <Text className={classes.clozeCard}>{parse(finalText, options)}</Text>
      );

      return () => {
        for (let i = 0; i < tempClozeCounter; i++) {
          document
            .getElementById(`cloze-field-${note.id}-${i + 1}`)
            ?.removeEventListener("click", function clozeEventListener() {
              console.log("remove event listener");
              this.classList.remove("active");
            });
        }
      };
    }, [note, showAllAnswers]);

    return node;
  },

  getSortFieldFromNoteContent(content) {
    return toPreviewString(
      content.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
        match.slice(6, -2)
      )
    );
  },

  editor(note: Note<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor note={note} deck={deck} mode={mode} />;
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

const ClozeCardComponent = memo(
  ({
    occluded,
    card,
    content,
  }: {
    occluded: boolean;
    card?: Card<CardType.Cloze>;
    content?: NoteContent<CardType.Cloze>;
  }) => {
    let finalText = content?.text ?? "";
    if (card) {
      finalText = finalText.replace(
        new RegExp(`{{c${card.content.occlusionNumber}::((?!{{|}}).)*}}`, "g"),
        (match) =>
          `<span class="cloze-field"><span class="cloze-content ${
            occluded && "occluded"
          }">${match.slice(6, -2)}</span></span>`
      );
    }
    finalText = finalText.replace(
      /\{\{c\d::((?!\{\{|}}).)*\}\}/g,
      (match) =>
        `<span class="cloze-field inactive"><span class="cloze-content">${match.slice(
          6,
          -2
        )}</span></span>`
    );
    return (
      <Text
        dangerouslySetInnerHTML={{ __html: finalText }}
        className={classes.clozeCard}
      />
    );
  }
);

function ClozeField({
  children,
  alwaysVisible,
}: { children: ReactNode; alwaysVisible?: boolean }) {
  const [occluded, setOccluded] = useState(true);

  return (
    <UnstyledButton
      className={classes.clozeField}
      onClick={() => setOccluded(!occluded)}
    >
      <span
        className={cx({
          [classes.occludable]: true,
          [classes.occluded]: occluded && !alwaysVisible,
        })}
      >
        {children}
      </span>
    </UnstyledButton>
  );
}

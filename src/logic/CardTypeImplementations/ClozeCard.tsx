import { Text } from "@mantine/core";
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

  displayNote(note: Note<CardType.Cloze>) {
    return <ClozeCardComponent occluded={false} content={note.content} />;
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

function ClozeCardComponent({
  occluded,
  card,
  content,
}: {
  occluded: boolean;
  card?: Card<CardType.Cloze>;
  content?: NoteContent<CardType.Cloze>;
}) {
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

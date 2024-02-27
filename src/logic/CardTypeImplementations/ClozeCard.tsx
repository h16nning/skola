import { Text } from "@mantine/core";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
import { TypeManager, EditMode } from "../TypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  deleteCard,
  newCard,
  toPreviewString,
  updateCard,
} from "../card";
import { db } from "../db";
import { Deck } from "../deck";
import {
  ClozeNoteContent,
  Note,
  NoteContent,
  getNote,
  newNote,
  registerReferencesToNote,
  removeReferenceToNote,
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
      text: string
    ) {
      return {
        ...createCardSkeleton(),
        note: noteId,
        preview: toPreviewString(
          text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
            match.slice(6, -2)
          )
        ),
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
      const createdCardIds = await Promise.all(
        params.occlusionNumberSet.map(async (occlusionNumber) => {
          return await newCard(
            createClozeCard(noteId, occlusionNumber, params.text),
            deck
          );
        })
      );
      await registerReferencesToNote(noteId, createdCardIds);
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
      // Not really needed, preview may be removed from the card itself. But here we might want to update occlusion numbers or delete cards if they are removed from the note.
      await Promise.all(
        existingNote.referencedBy.map((cardId) =>
          updateCard(cardId, {
            preview: toPreviewString(
              params.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
                match.slice(6, -2)
              )
            ),
          })
        )
      );
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
      await removeReferenceToNote(card.note, card.id);
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

import { Text } from "@mantine/core";
import ClozeCardEditor from "../../components/editcard/CardEditor/ClozeCardEditor";
import { CardTypeManager, EditMode } from "../CardTypeManager";
import {
  Card,
  CardType,
  createCardSkeleton,
  deleteCard,
  toPreviewString,
  updateCard,
} from "../card";
import { db } from "../db";
import { Deck } from "../deck";
import {
  ClozeNoteContent,
  NoteContent,
  getNote,
  newNote,
  registerReferencesToNote,
  removeReferenceToNote,
  updateNote,
} from "../note";
import classes from "./ClozeCard.module.css";

export type ClozeContent = {
  occlusionNumber: number;
};

export const ClozeCardUtils: CardTypeManager<CardType.Cloze> = {
  updateCard(params: { text: string }, existingCard: Card<CardType.Cloze>) {
    updateNote(existingCard.note, {
      type: CardType.Cloze,
      text: params.text,
    });
    updateCard(existingCard.id, {
      preview: toPreviewString(
        params.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
          match.slice(6, -2)
        )
      ),
    });
    return { preview: toPreviewString(params.text), ...existingCard };
  },

  createCard(params: {
    occlusionNumber: number;
    noteId: string;
    text: string;
  }): Card<CardType.Cloze> {
    return {
      ...createCardSkeleton(),
      note: params.noteId,
      preview: toPreviewString(
        params.text.replace(/\{\{c\d::((?!\{\{|}}).)*\}\}/g, (match) =>
          match.slice(6, -2)
        )
      ),
      content: {
        type: CardType.Cloze,
        occlusionNumber: params.occlusionNumber,
      },
    };
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

  editor(card: Card<CardType.Cloze> | null, deck: Deck, mode: EditMode) {
    return <ClozeCardEditor card={card} deck={deck} mode={mode} />;
  },

  async deleteCard(card: Card<CardType.Cloze>) {
    db.transaction("rw", db.decks, db.cards, db.notes, async () => {
      const noteText = await getNote(card.note).then((n) =>
        n !== undefined ? (n.content as ClozeNoteContent).text : undefined
      );
      if (noteText !== undefined) {
        await updateNote(card.note, {
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
  card: Card<CardType.Cloze>;
  content?: NoteContent<CardType.Cloze>;
}) {
  let finalText = content?.text ?? "";
  finalText = finalText.replace(
    new RegExp(`{{c${card.content.occlusionNumber}::((?!{{|}}).)*}}`, "g"),
    (match) =>
      `<span class="cloze-field"><span class="cloze-content ${
        occluded && "occluded"
      }">${match.slice(6, -2)}</span></span>`
  );
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

export async function createClozeCardSet(params: {
  deckId: string;
  text: string;
  occlusionNumberSet: number[];
}): Promise<Card<CardType.Cloze>[]> {
  const noteId = await newNote(params.deckId, {
    type: CardType.Cloze,
    text: params.text,
  });
  const createdCards = params.occlusionNumberSet.map((occlusionNumber) =>
    ClozeCardUtils.createCard({
      occlusionNumber: occlusionNumber,
      noteId: noteId,
      text: params.text,
    })
  );
  await registerReferencesToNote(
    noteId,
    createdCards.map((card) => card.id)
  );
  return createdCards;
}

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
import { Text } from "@/components/ui/Text";
import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from "html-react-parser";
import { ReactNode, memo, useState } from "react";
import { ClozeNoteContent } from "./types";

const BASE = "cloze-note";

export const ClozeNoteTypeAdapter: NoteTypeAdapter<NoteType.Cloze> = {
  createNote(
    params: { text: string; occlusionNumberSet: number[] },
    deck: Deck
  ) {
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

    const options: HTMLReactParserOptions = {
      replace(domNode) {
        if (
          domNode instanceof Element &&
          domNode.attribs.class &&
          domNode.attribs.class.includes("interactive-cloze-field-replace")
        ) {
          const isActive = domNode.attribs.class.endsWith("active");
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
      <Text className={`${BASE}__card`}>{parse(finalText, options)}</Text>
    );
  }
);

function ClozeField({
  children,
  controlledIsVisible,
  active,
}: { children: ReactNode; controlledIsVisible?: boolean; active?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);

  const classNames = [
    `${BASE}__field`,
    active && `${BASE}__field--active`,
    controlledIsVisible === undefined && `${BASE}__field--interactive`,
  ]
    .filter(Boolean)
    .join(" ");

  const occludableClassNames = [
    `${BASE}__occludable`,
    (controlledIsVisible === undefined ? isVisible : controlledIsVisible) &&
      `${BASE}__occludable--visible`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      onClick={() => setIsVisible(!isVisible)}
      type="button"
    >
      <span className={occludableClassNames}>{children}</span>
    </button>
  );
}

const styles = `
.${BASE}__card {
  line-height: 1.5;
}

.${BASE}__field {
  all: unset;
  vertical-align: baseline;
  padding: 0 var(--spacing-xs);
  border-radius: var(--radius-sm);
  background-color: var(--theme-neutral-100);
  border-bottom: solid 2px var(--theme-neutral-400);
  cursor: text;
  display: inline;
}

.${BASE}__field--active {
  background-color: var(--theme-primary-100);
  border-bottom-color: var(--theme-primary-600);
}

.${BASE}__field--active .${BASE}__occludable {
  transition: none;
}

.${BASE}__field--interactive {
  cursor: pointer;
}

.${BASE}__field--interactive:hover {
  background-color: var(--theme-neutral-200);
}

.${BASE}__occludable {
  opacity: 0;
  transition: opacity 0.1s;
}

.${BASE}__occludable--visible {
  opacity: 1;
}
`;

if (typeof document !== "undefined") {
  const styleId = `${BASE}-styles`;
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

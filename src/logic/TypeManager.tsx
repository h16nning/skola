import { ReactNode } from "react";
import { ClozeCardUtils } from "./CardTypeImplementations/ClozeCard";
import { DoubleSidedCardUtils } from "./CardTypeImplementations/DoubleSidedCard";
import { NormalCardUtils } from "./CardTypeImplementations/NormalCard";
import { UndefinedCardUtils } from "./CardTypeImplementations/UndefinedCard";
import { Card, NoteType } from "./card";
import { Deck } from "./deck";
import { Note, NoteContent } from "./note";

export interface TypeManager<T extends NoteType> {
  //DEPRECEATED
  deleteCard: (card: Card<T>) => void;

  createNote: (params: any, deck: Deck) => Promise<any>;

  updateNote: (params: any, existingNote: Note<T>) => Promise<any>;

  displayQuestion(
    card: Card<T>,
    content?: NoteContent<T>,
    place?: "learn" | "notebook"
  ): ReactNode;

  displayAnswer(
    card: Card<T>,
    content?: NoteContent<T>,
    place?: "learn" | "notebook"
  ): ReactNode;

  /**
   * Displays the contents of a note.
   *
   * @param note The note to display
   * @param showAllAnswers If "strict", the answer(s) is / are always shown. If "facultative", the answer may be shown if there is only one answer. If there are multiple answers, displayNote may ignore this parameter and implement its own logic to individually toggle the answers. If "none", no answer are shown.
   */
  displayNote(
    note: Note<T>,
    showAllAnswers: "strict" | "facultative" | "none"
  ): ReactNode;

  getSortFieldFromNoteContent(content: NoteContent<T>): string;

  editor(props: NoteEditorProps): JSX.Element;
}

export type EditMode = "edit" | "new";

export interface NoteEditorProps {
  note: Note<NoteType> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish: boolean;
  setRequestedFinish: (finish: boolean) => void;
  setNoteType?: (type: NoteType) => void;
  focusSelectNoteType?: () => void;
}

export function getUtils(
  a: Card<NoteType> | Note<NoteType>
): TypeManager<NoteType> {
  return getUtilsOfType(a.content ? a.content.type : NoteType.Undefined);
}

export function getUtilsOfType(cardType: NoteType): TypeManager<NoteType> {
  switch (cardType) {
    case NoteType.Normal:
      // @ts-ignore
      return NormalCardUtils;
    case NoteType.Cloze:
      // @ts-ignore
      return ClozeCardUtils;
    case NoteType.DoubleSided:
      // @ts-ignore
      return DoubleSidedCardUtils;
    case NoteType.Undefined:
      // @ts-ignore
      return UndefinedCardUtils;
  }
  // @ts-ignore
  return NormalCardUtils;
}

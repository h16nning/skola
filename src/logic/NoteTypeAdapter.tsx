import { NoteContent } from "@/logic/note/NoteContent";
import { ReactNode } from "react";
import { Card } from "./card/card";
import { Deck } from "./deck/deck";
import { NoteType } from "./note/note";
import { Note } from "./note/note";
import { ClozeNoteTypeAdapter } from "./type-implementations/cloze/ClozeNote";
import { DoubleSidedNoteTypeAdapter } from "./type-implementations/double-sided/DoubleSidedNote";
import { ImageOcclusionTypeAdapter } from "./type-implementations/image-occlusion/ImageOcclusionNote";
import { BasicNoteTypeAdapter } from "./type-implementations/normal/BasicNote";
import { UndefinedNoteTypeAdapter } from "./type-implementations/undefined/UndefinedNote";

export interface NoteTypeAdapter<T extends NoteType> {
  //DEPRECEATED
  deleteCard: (card: Card<T>) => void;

  createNote: (params: any, deck: Deck) => Promise<any>;

  updateNote: (params: any, existingNote: Note<T>) => Promise<any>;

  displayQuestion(
    card: Card<T>,
    content?: NoteContent<T>,
    // TODO: rename this parameter
    place?: "learn" | "notebook"
  ): ReactNode;

  displayAnswer(
    card: Card<T>,
    content?: NoteContent<T>,
    // TODO: rename this parameter
    place?: "learn" | "notebook"
  ): ReactNode;

  /**
   * Displays the contents of a note.
   *
   * @param note The note to display
   * @param showAllAnswers If "strict", the answer(s) is / are always shown. "optional": the answer may be shown if there is only one answer. If there are multiple answers, displayNote may ignore this parameter and implement its own logic to individually toggle the answers. If "none", no answer are shown.
   */
  displayNote(
    note: Note<T>,
    showAllAnswers: "strict" | "optional" | "none"
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

export function getAdapter(
  a: Card<NoteType> | Note<NoteType>
): NoteTypeAdapter<NoteType> {
  return getAdapterOfType(a.content ? a.content.type : NoteType.Undefined);
}

export function getAdapterOfType<T extends NoteType>(
  type: T
): NoteTypeAdapter<T> {
  const adapters = {
    [NoteType.DoubleSided]: DoubleSidedNoteTypeAdapter,
    [NoteType.Basic]: BasicNoteTypeAdapter,
    [NoteType.Cloze]: ClozeNoteTypeAdapter,
    [NoteType.ImageOcclusion]: ImageOcclusionTypeAdapter,
    [NoteType.Undefined]: UndefinedNoteTypeAdapter,
  };
  return adapters[type] as NoteTypeAdapter<T>;
}

import { TypeManager } from "../TypeManager";
import { NoteType } from "../card";

export const UndefinedCardUtils: TypeManager<NoteType.Undefined> = {
  createNote() {
    console.warn("tried to create note of type undefined. Not possible.");
    return Promise.resolve();
  },

  updateNote() {
    console.warn("tried to update note of type undefined. Not possible.");
    return Promise.resolve();
  },

  displayQuestion() {
    return "[Undefined Card] Question";
  },

  displayAnswer() {
    return "[Undefined Card] Answer";
  },

  displayNote() {
    return <span>[Undefined Card] Note</span>;
  },

  getSortFieldFromNoteContent() {
    return "[Undefined Card] Sort Field";
  },

  editor() {
    return <span>Undefined Card Editor</span>;
  },

  deleteCard() {
    console.warn("tried to delete card of type undefined. Not possible.");
  },
};

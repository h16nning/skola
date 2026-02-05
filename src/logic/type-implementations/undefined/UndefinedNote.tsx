import { NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";

export const UndefinedNoteTypeAdapter: NoteTypeAdapter<NoteType.Undefined> = {
  createNote() {
    console.warn("tried to create note of type undefined. Not possible.");
    return Promise.resolve(undefined);
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

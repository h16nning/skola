import { NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";

export const ImageOcclusionTypeAdapter: NoteTypeAdapter<NoteType.DoubleSided> =
  {
    createNote() {
      console.warn(
        "tried to create note of type image occlusion. Not implemented."
      );
      return Promise.resolve(undefined);
    },

    updateNote() {
      console.warn(
        "tried to update note of type image occlusion. Not implemented."
      );
      return Promise.resolve();
    },

    displayQuestion() {
      return "[Image Occlusion Card] Question";
    },

    displayAnswer() {
      return "[Image Occlusion Card] Answer";
    },

    displayNote() {
      return <span>[Image Occlusion Card] Note</span>;
    },

    getSortFieldFromNoteContent() {
      return "[Image Occlusion Card] Sort Field";
    },

    editor() {
      return <span>Image Occlusion Card Editor</span>;
    },

    deleteCard() {
      console.warn(
        "tried to delete card of type image occlusion. Not implemented."
      );
    },
  };

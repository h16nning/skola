import { NoteContent } from "./NoteContent";

export interface NoteSkeleton {
  id: string;
  deck: string;
  creationDate: Date;
  customOrder?: number;
  /*
  An array of note identifiers linked to this note, enabling non-linear interconnections for mind maps and graph views. This supports advanced note-taking methodologies, including incremental writing and higher-order thinking strategies.
  */
  linkedNotes: string[];
}

export interface Note<T extends NoteType> extends NoteSkeleton {
  content: NoteContent<T>;
  sortField: string;
}

export enum NoteType {
  Basic = "normal",
  Cloze = "cloze",
  ImageOcclusion = "imageOcclusion",
  DoubleSided = "doubleSided",
  Undefined = "undefined",
}

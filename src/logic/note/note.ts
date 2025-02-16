import { NoteContent } from "./NoteContent";

export interface NoteSkeleton {
  id: string;
  deck: string;
  creationDate: Date;
  customOrder?: number;
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

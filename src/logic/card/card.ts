import { Card as Model, ReviewLog } from "fsrs.js";
import i18n from "../../i18n";
import { NoteType } from "../note/note";
import { Content } from "./CardContent";

export const NoteTypeLabels: Record<NoteType, string> = {
  get [NoteType.Basic]() {
    return i18n.t("note.type.normal");
  },
  get [NoteType.Cloze]() {
    return i18n.t("note.type.cloze");
  },
  get [NoteType.ImageOcclusion]() {
    return i18n.t("note.type.image-occlusion");
  },
  get [NoteType.DoubleSided]() {
    return i18n.t("note.type-double-sided");
  },
  get [NoteType.Undefined]() {
    return i18n.t("note.type.undefined");
  },
};

export interface CardSkeleton {
  id: string;
  history: ReviewLog[];
  model: Model;
  deck: string;
  creationDate: Date;
  customOrder?: number;
}

export interface Card<T extends NoteType> extends CardSkeleton {
  content: Content<T>;
  note: string;
}

export function HTMLtoPreviewString(text: string): string {
  return text.replace(/<[^>]*>/g, "").slice(0, 100);
}

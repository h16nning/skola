import { ClozeContent } from "./CardTypeImplementations/ClozeCard";
import { DoubleSidedContent } from "./CardTypeImplementations/DoubleSidedCard";
import { NormalContent } from "./CardTypeImplementations/NormalCard";
import { NoteType } from "./card";

export type Content<T extends NoteType> = {
  type: T;
} & (T extends NoteType.Normal ? NormalContent : {}) &
  (T extends NoteType.Cloze ? ClozeContent : {}) &
  (T extends NoteType.DoubleSided ? DoubleSidedContent : {});

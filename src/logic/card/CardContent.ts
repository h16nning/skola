import { NoteType } from "../note/note";
import { ClozeCardContent } from "../type-implementations/cloze/types";
import { DoubleSidedCardContent } from "../type-implementations/double-sided/types";
import { NormalCardContent } from "../type-implementations/normal/types";

export type Content<T extends NoteType> = {
  type: T;
} & (T extends NoteType.Basic ? NormalCardContent : {}) &
  (T extends NoteType.Cloze ? ClozeCardContent : {}) &
  (T extends NoteType.DoubleSided ? DoubleSidedCardContent : {});

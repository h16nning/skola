import { CardType } from "./card";
import { NormalContent } from "./CardTypeImplementations/NormalCard";
import { ClozeContent } from "./CardTypeImplementations/ClozeCard";

export type Content<T extends CardType> = {
  type: T;
} & (T extends CardType.Normal ? NormalContent : {}) &
  (T extends CardType.Cloze ? ClozeContent : {});

import { CardType } from "./card";
import { NormalContent } from "./CardTypeImplementations/NormalCard";
import { ClozeContent } from "./CardTypeImplementations/ClozeCard";
import { DoubleSidedContent } from "./CardTypeImplementations/DoubleSidedCard";

export type Content<T extends CardType> = {
  type: T;
} & (T extends CardType.Normal ? NormalContent : {}) &
  (T extends CardType.Cloze ? ClozeContent : {}) &
  (T extends CardType.DoubleSided ? DoubleSidedContent : {});

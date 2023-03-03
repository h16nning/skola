import { Card, CardType } from "./card";

export type Content<T extends CardType> = {
  type: T;
  front: string;
} & (T extends CardType.Normal ? NormalContent : {}) &
  (T extends CardType.Cloze ? ClozeContent : {});

type NormalContent = {
  back: string;
};

type ClozeContent = {
  clozeCards: Array<string>;
};

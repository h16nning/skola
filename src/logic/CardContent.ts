import { CardType } from "./card";

export type Content<T> = BaseContent<T> & (NormalContent | ClozeContent);

export type BaseContent<T> = {
  type: T;
};

interface NormalContent extends BaseContent<CardType.Normal> {
  front: string;
  back: string;
}

interface ClozeContent extends BaseContent<CardType.Cloze> {
  front: string;
  clozeCards: Array<string>;
}

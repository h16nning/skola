import { Content } from "./CardContent";
import { v4 as uuidv4 } from "uuid";

export enum CardType {
  Normal = "normal",
  Cloze = "cloze",
  ImageOcclusion = "imageOcclusion",
}

export interface CardSkeleton {
  id: string;
  history: Array<Object>;
}

export interface Card<T extends CardType> extends CardSkeleton {
  content: Content<T>;
}

export function createCardSkeleton() {
  const id = uuidv4();
  return { id: id, history: [] };
}

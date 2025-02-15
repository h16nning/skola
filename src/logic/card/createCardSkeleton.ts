import { Card as Model } from "fsrs.js";
import { v4 as uuidv4 } from "uuid";
import { CardSkeleton } from "./card";

export function createCardSkeleton(): CardSkeleton {
  const id = uuidv4();
  return {
    id: id,
    history: [],
    deck: "[preview not set]",
    model: new Model(),
    creationDate: new Date(Date.now()),
  };
}

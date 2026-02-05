import { v4 as uuidv4 } from "uuid";
import { NoteSkeleton } from "./note";

export function createNoteSkeleton(deck: string): NoteSkeleton {
  return {
    deck: deck,
    creationDate: new Date(Date.now()),
    id: uuidv4(),
    linkedNotes: [],
  };
}

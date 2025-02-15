import { NoteType } from "../note/note";
import { Card } from "./card";

export function isCard(
  card: Card<NoteType> | undefined
): card is Card<NoteType> {
  return !!card;
}

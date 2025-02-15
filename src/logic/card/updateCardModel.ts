import { Card as Model, ReviewLog } from "fsrs.js";
import { db } from "../db";
import { NoteType } from "../note/note";
import { Card } from "./card";

export async function updateCardModel(
  card: Card<NoteType>,
  model: Model,
  log: ReviewLog
) {
  return db.cards.update(card.id, {
    model: model,
    history: [...card.history, log],
  });
}

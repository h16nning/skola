import { Card as Model, ReviewLog } from "fsrs.js";
import { db } from "../db";
import { invalidateDeckStatsCacheForCard } from "../deck/deckStatsCacheManager";
import { NoteType } from "../note/note";
import { Card } from "./card";

export async function updateCardModel(
  card: Card<NoteType>,
  model: Model,
  log: ReviewLog
) {
  await db.cards.update(card.id, {
    model: model,
    history: [...card.history, log],
  });

  await invalidateDeckStatsCacheForCard(card.id);
}

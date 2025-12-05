import { getAdapterOfType } from "@/logic/NoteTypeAdapter";
import { Deck } from "@/logic/deck/deck";
import { NoteType } from "@/logic/note/note";

export async function importCards(
  text: string | null,
  deck: Deck | undefined,
  cardSeparator: string,
  questionAnswerSeperator: string
) {
  if (!text || !deck) {
    return;
  }
  const questionAnswerPairs = text
    .split(cardSeparator)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      return line.split(questionAnswerSeperator);
    });

  await Promise.all(
    questionAnswerPairs.map(async (pair) => {
      if (pair.length < 2) return; 
      return getAdapterOfType(NoteType.Basic).createNote(
        {
          front: pair[0],
          back: pair[1],
        },
        deck
      );
    })
  );
}


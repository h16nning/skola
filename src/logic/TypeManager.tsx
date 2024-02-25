import { ReactNode } from "react";
import { Card, CardType } from "./card";
import { Deck } from "./deck";
import { NormalCardUtils } from "./CardTypeImplementations/NormalCard";
import { ClozeCardUtils } from "./CardTypeImplementations/ClozeCard";
import { DoubleSidedCardUtils } from "./CardTypeImplementations/DoubleSidedCard";
import { UndefinedCardUtils } from "./CardTypeImplementations/UndefinedCard";
import { Note, NoteContent } from "./note";

export interface TypeManager<T extends CardType> {
  createCard: (params: any) => Card<T>;

  updateCard: (params: any, existingCard: Card<T>) => Card<T>;

  displayQuestion(
    card: Card<T>,
    content?: NoteContent<T>,
    place?: "learn" | "notebook"
  ): ReactNode;

  displayAnswer(
    card: Card<T>,
    content?: NoteContent<T>,
    place?: "learn" | "notebook"
  ): ReactNode;

  displayNote(note: Note<T>): ReactNode;

  getSortFieldFromNote(note: Note<T>): string;

  editor(card: Card<CardType> | null, deck: Deck, mode: EditMode): JSX.Element;

  deleteCard: (card: Card<T>) => void;
}

export type EditMode = "edit" | "new";

export function getUtils(
  a: Card<CardType> | Note<CardType>
): TypeManager<CardType> {
  return getUtilsOfType(a.content ? a.content.type : CardType.Undefined);
}

export function getUtilsOfType(cardType: CardType): TypeManager<CardType> {
  switch (cardType) {
    case CardType.Normal:
      // @ts-ignore
      return NormalCardUtils;
    case CardType.Cloze:
      // @ts-ignore
      return ClozeCardUtils;
    case CardType.DoubleSided:
      // @ts-ignore
      return DoubleSidedCardUtils;
    case CardType.Undefined:
      // @ts-ignore
      return UndefinedCardUtils;
  }
  // @ts-ignore
  return NormalCardUtils;
}

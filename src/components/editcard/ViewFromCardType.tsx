import { Deck } from "../../logic/deck";
import { Card, CardType } from "../../logic/card";
import NormalCardEditor from "./NormalCardEditor";
import React from "react";

export function getViewFromCardType(
  deck: Deck | undefined,
  cardType: string | null,
  card?: Card<CardType>
) {
  if (!deck) {
    return <></>;
  }
  switch (cardType) {
    case CardType.Normal:
      return (
        <NormalCardEditor deck={deck} card={card as Card<CardType.Normal>} />
      );
    case CardType.Cloze:
      return "Cloze";
    case CardType.ImageOcclusion:
      return "Image Occlusion";
  }
}

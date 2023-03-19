import React from "react";
import { Card, CardType } from "../../logic/card";
import { EditMode } from "../CardTypeManager";
import { Deck } from "../../logic/deck";

interface ClozeCardEditorProps {
  card: Card<CardType.Cloze> | null;
  deck: Deck;
  mode: EditMode;
}

export default function ClozeCardEditor({}: ClozeCardEditorProps) {
  return <div></div>;
}

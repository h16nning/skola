import React from "react";
import { Stack, Text } from "@mantine/core";
import CardTextEditor, { useCardEditor } from "./CardTextEditor";
import { EditMode, NormalCardUtils } from "../CardTypeManager";
import { Card, CardType } from "../../logic/card";
import { Deck } from "../../logic/deck";
import CardEditorFooter from "./CardEditorFooter";

interface NormalCardEditorProps {
  card: Card<CardType.Normal> | null;
  deck: Deck;
  mode: EditMode;
}

function NormalCardEditor({ card, deck, mode }: NormalCardEditorProps) {
  const frontEditor = useCardEditor(card?.content.front ?? "");
  const backEditor = useCardEditor(card?.content.back ?? "");

  return (
    <Stack>
      <Stack spacing={0}>
        <Text fz="sm" fw={700}>
          Front Side
        </Text>
        <CardTextEditor editor={frontEditor} key="front" />
      </Stack>
      <Stack spacing={0}>
        <Text fz="sm" fw={700}>
          Back Side
        </Text>
        <CardTextEditor editor={backEditor} key="back" />
      </Stack>
      <CardEditorFooter
        createCardInstance={() =>
          card
            ? NormalCardUtils.update(
                { front: frontEditor?.getHTML(), back: backEditor?.getHTML() },
                card
              )
            : NormalCardUtils.create({
                front: frontEditor?.getHTML(),
                back: backEditor?.getHTML(),
              })
        }
        clear={() => {
          frontEditor?.commands.setContent("");
          backEditor?.commands.setContent("");
          frontEditor?.commands.focus();
        }}
        deck={deck}
        mode={mode}
      />
    </Stack>
  );
}

export default NormalCardEditor;

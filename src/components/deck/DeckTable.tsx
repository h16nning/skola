import React from "react";
import { Stack } from "@mantine/core";
import DeckPreview from "./DeckPreview";
import { Deck } from "../../logic/deck";

interface DeckTableProps {
  deckList: Deck[];
}

function DeckTable({ deckList }: DeckTableProps) {
  return (
    <Stack spacing={0}>
      {deckList.map((deck, index) => (
        <DeckPreview key={index} deck={deck} i={index} />
      ))}
    </Stack>
  );
}

export default DeckTable;

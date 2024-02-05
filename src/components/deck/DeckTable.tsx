import React from "react";
import { Text, Stack } from "@mantine/core";
import DeckPreview from "./DeckPreview";
import { Deck } from "../../logic/deck";
import LazySkeleton from "../custom/LazySkeleton";

interface DeckTableProps {
  deckList?: Deck[];
  isReady: boolean;
}

function DeckTable({ deckList, isReady }: DeckTableProps) {
  return isReady && deckList ? (
    deckList.length !== 0 ? (
      <Stack gap="0" w="100%">
        {deckList.map((deck, index) => (
          <DeckPreview key={index} deck={deck} i={index} />
        ))}
      </Stack>
    ) : (
      <Text fz="sm" c="dimmed" pt="lg" ta="center">
        You have not created any decks yet. Click the button above to create
        one!
      </Text>
    )
  ) : (
    <SkeletonTable />
  );
}

function SkeletonTable() {
  return (
    <>
      <Stack gap="xs">
        <LazySkeleton key={1} h="48px"></LazySkeleton>
        <LazySkeleton key={2} h="48px"></LazySkeleton>
        <LazySkeleton key={3} h="48px"></LazySkeleton>
      </Stack>
    </>
  );
}

export default DeckTable;

import React from "react";
import { Skeleton, Text, Stack } from "@mantine/core";
import DeckPreview from "./DeckPreview";
import { Deck } from "../../logic/deck";
import LazySkeleton from "../../logic/LazySkeleton";

interface DeckTableProps {
  deckList?: Deck[];
}

function DeckTable({ deckList }: DeckTableProps) {
  return deckList ? (
    deckList.length !== 0 ? (
      <Stack spacing={0}>
        {deckList.map((deck, index) => (
          <DeckPreview key={index} deck={deck} i={index} />
        ))}
      </Stack>
    ) : (
      <Text fz="sm" c="gray">
        There are not any decks here.
      </Text>
    )
  ) : (
    <SkeletonTable />
  );
}

function SkeletonTable() {
  return (
    <>
      <Stack spacing="xs">
        <LazySkeleton key={1} h="48px"></LazySkeleton>
        <LazySkeleton key={2} h="48px"></LazySkeleton>
        <LazySkeleton key={3} h="48px"></LazySkeleton>
      </Stack>
    </>
  );
}

export default DeckTable;

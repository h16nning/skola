import LazySkeleton from "@/components/LazySkeleton";
import { Stack, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Deck } from "../../logic/deck/deck";
import DeckPreview from "./DeckPreview";

interface DeckTableProps {
  deckList?: Deck[];
  isReady: boolean;
}

function DeckTable({ deckList, isReady }: DeckTableProps) {
  const [t] = useTranslation();

  const navigate = useNavigate();
  useHotkeys(
    deckList
      ?.slice(0, 9)
      .map((d, i) => [(i + 1).toString(), () => navigate(`/deck/${d.id}`)]) ??
      []
  );

  return isReady && deckList ? (
    deckList.length !== 0 ? (
      <Stack gap="0" w="100%">
        {deckList
          .sort((a: Deck, b: Deck) => a.name.localeCompare(b.name))
          .map((deck, index) => (
            <DeckPreview key={deck.id} deck={deck} i={index} />
          ))}
      </Stack>
    ) : (
      <Text fz="sm" c="dimmed" pt="lg" ta="center">
        {t("deck.no-decks-found")}
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

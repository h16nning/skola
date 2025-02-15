import { Deck } from "@/logic/deck";
import { Select, Stack, Text } from "@mantine/core";
import React from "react";
import { useParams } from "react-router-dom";

interface SelectDecksHeaderProps {
  label: string;
  disableAll?: boolean;
  decks?: Deck[];
  onSelect: (deckId: string | null) => void;
}

export default function SelectDecksHeader({
  decks,
  label,
  disableAll,
  onSelect,
}: SelectDecksHeaderProps) {
  const deckId = useParams().deckId || "";
  return (
    <Stack gap="0.25rem">
      <Text fz="sm" c="dimmed">
        {label}
      </Text>
      <Select
        placeholder="Pick one"
        searchable
        nothingFoundMessage="No decks Found"
        data={(disableAll ? [] : [{ value: "", label: "All" }]).concat(
          decks?.map((deck) => ({
            value: deck.id,
            label: deck.name,
          })) ?? []
        )}
        value={deckId}
        onChange={(value) => onSelect(value)}
      />
    </Stack>
  );
}

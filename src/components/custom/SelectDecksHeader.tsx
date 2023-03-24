import React from "react";
import { Select, Stack, Text } from "@mantine/core";
import { swapLight } from "../../logic/ui";
import { Deck } from "../../logic/deck";
import { useLocation, useNavigate } from "react-router-dom";

interface SelectDecksHeaderProps {
  label: string;
  disableAll?: boolean;
  decks?: Deck[];
}

export default function SelectDecksHeader({
  decks,
  label,
  disableAll,
}: SelectDecksHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack spacing="0.25rem">
      <Text
        sx={(theme) => ({
          color: swapLight(theme),
          fontSize: theme.fontSizes.sm,
        })}
      >
        {label}
      </Text>
      <Select
        placeholder="Pick one"
        searchable
        nothingFound="No decks Found"
        data={(disableAll ? [] : [{ value: "", label: "All" }]).concat(
          decks?.map((deck) => ({
            value: deck.id,
            label: deck.name,
          })) ?? []
        )}
        value={location.pathname.split("/")[2] ?? ""}
        onChange={(value) => {
          const pathname = location.pathname.split("/")[1];
          return navigate(`/${pathname}${value !== "" ? "/" + value : ""}`);
        }}
      />
    </Stack>
  );
}

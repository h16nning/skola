import common from "../../style/CommonStyles.module.css";
import React from "react";
import { Select, Stack, Text } from "@mantine/core";
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
        value={location.pathname.split("/")[2] ?? ""}
        onChange={(value) => {
          const pathname = location.pathname.split("/")[1];
          return navigate(`/${pathname}${value !== "" ? "/" + value : ""}`);
        }}
      />
    </Stack>
  );
}

import { Alert, Badge, Group, Text } from "@mantine/core";
import React from "react";
import { Deck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import ListButton from "../custom/ListButton";

type DeckPreviewProps = {
  deck: Deck;
  i: number;
};

export default function DeckPreview({ deck, i }: DeckPreviewProps) {
  const navigate = useNavigate();

  return (
    <ListButton
      i={i}
      onClick={() => {
        navigate("/deck/" + deck.id);
      }}
    >
      {deck ? (
        <Group position="apart" w="100%" noWrap={true}>
          <Text>{deck.name}</Text>
          <Group spacing="xs" noWrap={true}>
            <Badge variant="dot" color="red">
              3 fällig
            </Badge>
            <Badge variant="dot" color="blue">
              7 neu
            </Badge>
          </Group>
        </Group>
      ) : (
        <Alert title="Error" color="red" variant="filled">
          This card failed to load
        </Alert>
      )}
    </ListButton>
  );
}

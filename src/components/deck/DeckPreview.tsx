import { Alert, Badge, Group, Text } from "@mantine/core";
import React from "react";
import { Deck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import ListButton from "../custom/ListButton";
import { useCardsOf, useStatsOf } from "../../logic/card";

type DeckPreviewProps = {
  deck: Deck;
  i: number;
};

export default function DeckPreview({ deck, i }: DeckPreviewProps) {
  const navigate = useNavigate();
  const [cards, areCardsReady] = useCardsOf(deck);
  const stats = useStatsOf(cards);

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
            {stats.dueCards && stats.dueCards > 0 ? (
              <Badge variant="dot" color="green">
                {stats.dueCards} due
              </Badge>
            ) : (
              <></>
            )}
            {stats.newCards && stats.newCards > 0 ? (
              <Badge variant="dot" color="blue">
                {stats.newCards} new
              </Badge>
            ) : (
              <></>
            )}
            {stats.learningCards && stats.learningCards > 0 ? (
              <Badge variant="dot" color="red">
                {stats.learningCards} learning
              </Badge>
            ) : (
              <></>
            )}
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

import { Alert, Badge, Group, Text } from "@mantine/core";
import React from "react";
import { Deck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import ListButton from "../custom/ListButton/ListButton";
import { useCardsOf, useStatsOf } from "../../logic/card";
import { useTranslation } from "react-i18next";

type DeckPreviewProps = {
  deck: Deck;
  i: number;
};

export default function DeckPreview({ deck, i }: DeckPreviewProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [cards] = useCardsOf(deck);
  const stats = useStatsOf(cards);

  return (
    <ListButton
      i={i}
      onClick={() => {
        navigate("/deck/" + deck.id);
      }}
    >
      {deck ? (
        <Group justify="space-between" w="100%" wrap="nowrap">
          <Text>{deck.name}</Text>
          <Group gap="xs" wrap="nowrap">
            {stats.dueCards && stats.dueCards > 0 ? (
              <Badge variant="dot" color="blue">
                {stats.dueCards + " " + t("deck.review-cards-label")}
              </Badge>
            ) : (
              <></>
            )}
            {stats.newCards && stats.newCards > 0 ? (
              <Badge variant="dot" color="grape">
                {stats.newCards + " " + t("deck.new-cards-label")}
              </Badge>
            ) : (
              <></>
            )}
            {stats.learningCards && stats.learningCards > 0 ? (
              <Badge variant="dot" color="orange">
                {stats.learningCards + " " + t("deck.learning-cards-label")}
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

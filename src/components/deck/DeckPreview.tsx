import { Alert, Badge, Group, Text } from "@mantine/core";
import React from "react";
import { Deck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import ListButton from "../custom/ListButton/ListButton";
import { useCardsOf, useSimplifiedStatesOf } from "../../logic/card";
import { useTranslation } from "react-i18next";

type DeckPreviewProps = {
  deck: Deck;
  i: number;
};

export default function DeckPreview({ deck, i }: DeckPreviewProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [cards] = useCardsOf(deck);
  const states = useSimplifiedStatesOf(cards);

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
            {states.review > 0 ? (
              <Badge variant="dot" color="blue">
                {t("deck.review-cards-label", { count: -1 })}
              </Badge>
            ) : (
              <></>
            )}
            {states.new > 0 ? (
              <Badge variant="dot" color="grape">
                {t("deck.new-cards-label", { count: states.new })}
              </Badge>
            ) : (
              <></>
            )}
            {states.learning > 0 ? (
              <Badge variant="dot" color="orange">
                {t("deck.learning-cards-label", {
                  count: states.learning,
                })}
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

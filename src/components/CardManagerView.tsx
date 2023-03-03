import React, { useState } from "react";
import { Center, Group, Stack } from "@mantine/core";
import { Card, CardType, useCards, useCardsOf } from "../logic/card";
import { useLocation } from "react-router-dom";
import CardTable from "./sidebar/CardTable";
import EditCardView from "./editcard/EditCardView";
import { dummyDeck, useDeckFromUrl } from "../logic/deck";
import MissingObject from "./MissingObject";

interface CardManagerViewProps {}

function useDeckGiven(): boolean {
  const location = useLocation();
  return typeof location.pathname.split("/")[2] === "string";
}
function CardManagerView({}: CardManagerViewProps) {
  const [cardSet, setCardSet] = useState<Card<CardType>[]>();
  const deckGiven = useDeckGiven();
  return deckGiven ? <DeckCards /> : <AllCards />;
}

function AllCards() {
  const cards = useCards();
  return <Core cardSet={cards ?? []} />;
}

function DeckCards() {
  const [deck, failed] = useDeckFromUrl();
  const cards = useCardsOf(deck ?? dummyDeck);
  if (failed) {
    return <MissingObject />;
  }
  return <Core cardSet={cards} />;
}

interface CoreProps {
  cardSet: Card<CardType>[];
}
function Core({ cardSet }: CoreProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedCard, setSelectedCard] = useState<Card<CardType>>();
  return (
    <Center>
      <Group spacing="lg" align="start">
        <Stack w="600px">
          <CardTable
            cardSet={cardSet}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        </Stack>
        <Stack
          w="600px"
          h="800px"
          p="sm"
          sx={(theme) => ({
            border: "solid 1px " + theme.colors.gray[3],
            borderRadius: theme.radius.md,
          })}
        >
          <EditCardView card={selectedCard} />
        </Stack>
      </Group>
    </Center>
  );
}
export default CardManagerView;

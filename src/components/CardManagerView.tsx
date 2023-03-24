import React, { useState } from "react";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { Card, CardType, useCards, useCardsOf } from "../logic/card";
import { useLocation, useNavigate } from "react-router-dom";
import CardTable from "./CardTable";
import EditCardView from "./editcard/EditCardView";
import { useDeckFromUrl, useDecks } from "../logic/deck";
import MissingObject from "./custom/MissingObject";
import { swapMono } from "../logic/ui";
import { IconChevronLeft } from "@tabler/icons-react";
import SelectDecksHeader from "./custom/SelectDecksHeader";

function CardManagerView() {
  const navigate = useNavigate();
  const location = useLocation();

  const deckGiven = typeof location.pathname.split("/")[2] === "string";
  const [decks] = useDecks();

  return (
    <Stack w="100%">
      <Group align="end" spacing="xs">
        <ActionIcon
          onClick={() => {
            navigate(-1);
          }}
        >
          <IconChevronLeft />
        </ActionIcon>
        <SelectDecksHeader label="Showing cards in" decks={decks} />
      </Group>
      {deckGiven ? <DeckCards /> : <AllCards />}
    </Stack>
  );
}

function AllCards() {
  const cards = useCards();
  return <Core cardSet={cards ?? []} name="All Cards" />;
}

function DeckCards() {
  const [deck, isReady] = useDeckFromUrl();
  const [cards, areCardsReady] = useCardsOf(deck);
  if (!deck && isReady) {
    return <MissingObject />;
  }
  if (areCardsReady && !cards) {
    return (
      <Text c="red" fw={700}>
        Something went wrong while loading thse cards.
      </Text>
    );
  }
  return <Core cardSet={cards} name={deck?.name ?? ""} />;
}

interface CoreProps {
  cardSet?: Card<CardType>[];
  name: string;
}

function Core({ cardSet }: CoreProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedCard, setSelectedCard] = useState<Card<CardType>>();
  return (
    <Group spacing="lg" grow pr="lg" align="start">
      <Stack miw="300px" w="400px" maw="100%">
        {cardSet && (
          <CardTable
            cardSet={cardSet}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        )}
      </Stack>
      <Stack
        miw="300px"
        w="400px"
        maw="100%"
        p="sm"
        sx={(theme) => ({
          border: "solid 1px " + swapMono(theme, 3, 5),
          borderRadius: theme.radius.md,
        })}
      >
        <EditCardView card={selectedCard} />
      </Stack>
    </Group>
  );
}
export default CardManagerView;

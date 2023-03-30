import React, { useState } from "react";
import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { Card, CardType, useCardsWith } from "../logic/card";
import { useLocation, useNavigate } from "react-router-dom";
import CardTable from "./CardTable";
import EditCardView from "./editcard/EditCardView";
import { useDecks } from "../logic/deck";
import { swapMono } from "../logic/ui";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import SelectDecksHeader from "./custom/SelectDecksHeader";
import { Collection, IndexableType, Table } from "dexie";
import { useDebouncedState } from "@mantine/hooks";

function selectCards(
  cards: Table<Card<CardType>>,
  deckGiven: boolean,
  filter: string,
  location: any
): Promise<Card<CardType>[] | undefined> {
  let filteredCards:
    | Table<Card<CardType>>
    | Collection<Card<CardType>, IndexableType> = cards;
  console.log(filteredCards);

  if (deckGiven) {
    const deckId = location.pathname.split("/")[2];
    filteredCards = filteredCards.where("deck").equals(deckId);
  }
  if (filter.length > 0) {
    console.log(filter);
    filteredCards = filteredCards.filter((card) =>
      // @ts-ignore
      card.content.front.toLowerCase().includes(filter.toLowerCase())
    );
  }
  return filteredCards.toArray();
}

function CardManagerView() {
  const navigate = useNavigate();
  const location = useLocation();

  const deckGiven = typeof location.pathname.split("/")[2] === "string";
  const [decks] = useDecks();

  const [filter, setFilter] = useDebouncedState<string>("", 250);

  const [cards, cardsAreReady] = useCardsWith(
    (cards) => selectCards(cards, deckGiven, filter, location),
    [deckGiven, location, filter]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedCard, setSelectedCard] = useState<Card<CardType>>();

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
      <TextInput
        icon={<IconSearch />}
        defaultValue={filter}
        placeholder="Filter cards"
        maw="20rem"
        onChange={(event) => setFilter(event.currentTarget.value)}
      />
      <Group spacing="md" grow align="start">
        <Stack miw="300px" w="400px" maw="100%">
          {cards && (
            <CardTable
              cardSet={cards ?? []}
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
    </Stack>
  );
}

export default CardManagerView;

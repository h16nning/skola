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
import { useDebouncedState } from "@mantine/hooks";
import selectCards from "../logic/card_filter";

function CardManagerView() {
  const navigate = useNavigate();
  const location = useLocation();

  const deckGiven = typeof location.pathname.split("/")[2] === "string";
  const [decks] = useDecks();

  const [filter, setFilter] = useDebouncedState<string>("", 250);

  const [sort, setSort] = useState<[string, boolean]>(["front", true]);

  const [cards] = useCardsWith(
    (cards) => selectCards(cards, deckGiven, filter, sort, location),
    [deckGiven, location, filter, sort]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedCard, setSelectedCard] = useState<Card<CardType>>();

  return (
    <Stack sx={() => ({ overflow: "hidden", width: "100%", height: "100%" })}>
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
      <Group
        spacing="md"
        grow
        align="start"
        sx={(theme) => ({ overflow: "hidden", height: "100%" })}
      >
        <Stack miw="300px" w="400px" maw="100%" h="100%">
          {cards && (
            <CardTable
              cardSet={cards ?? []}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
              sort={sort}
              setSort={setSort}
            />
          )}
        </Stack>
        <Stack
          miw="300px"
          w="400px"
          maw="100%"
          p="sm"
          h="100%"
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

import classes from "./CardManagerView.module.css";
import React, { useState } from "react";
import { ActionIcon, Group, Stack, TextInput, Title } from "@mantine/core";
import { Card, CardType, useCardsWith } from "../../logic/card";
import { useLocation, useNavigate } from "react-router-dom";
import CardTable from "../CardTable/CardTable";
import EditCardView from "../editcard/EditCardView";
import { useDecks } from "../../logic/deck";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import SelectDecksHeader from "../custom/SelectDecksHeader";
import { useDebouncedState } from "@mantine/hooks";
import selectCards from "../../logic/card_filter";
import { AppHeaderContent } from "../Header/Header";

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
    <Stack style={{ overflow: "hidden", width: "100%", height: "100%" }}>
      <AppHeaderContent>
        <Title order={3}>Manage Cards</Title>
      </AppHeaderContent>
      <Group align="end" gap="xs">
        <SelectDecksHeader label="Showing cards in" decks={decks} />
      </Group>
      <TextInput
        leftSection={<IconSearch size={16} />}
        defaultValue={filter}
        placeholder="Filter cards"
        maw="20rem"
        onChange={(event) => setFilter(event.currentTarget.value)}
      />
      <Group
        gap="md"
        grow
        align="start"
        style={{ overflowY: "scroll", height: "100%" }}
      >
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
        <Stack className={classes.cardBox}>
          <EditCardView card={selectedCard} />
        </Stack>
      </Group>
    </Stack>
  );
}

export default CardManagerView;

import React, { useState } from "react";
import { ActionIcon, Group, Select, Stack, Text } from "@mantine/core";
import { Card, CardType, useCards, useCardsOf } from "../logic/card";
import { useLocation, useNavigate } from "react-router-dom";
import CardTable from "./CardTable";
import EditCardView from "./editcard/EditCardView";
import { dummyDeck, useDeckFromUrl, useDecks } from "../logic/deck";
import MissingObject from "./custom/MissingObject";
import { swapLight, swapMono } from "../logic/ui";
import { IconChevronLeft } from "@tabler/icons-react";

function CardManagerView() {
  const navigate = useNavigate();
  const location = useLocation();

  const deckGiven = typeof location.pathname.split("/")[2] === "string";
  const decks = useDecks();

  return (
    <Stack w="100%">
      <Group>
        <ActionIcon
          onClick={() => {
            navigate(-1);
          }}
        >
          <IconChevronLeft />
        </ActionIcon>
        <Stack spacing="xs">
          <Text
            sx={(theme) => ({
              color: swapLight(theme),
              fontSize: theme.fontSizes.sm,
            })}
          >
            Showing cards in
          </Text>
          <Select
            placeholder="Pick one"
            searchable
            nothingFound="No Decks Found"
            data={[{ value: "", label: "All" }].concat(
              decks?.map((deck) => ({
                value: deck.id,
                label: deck.name,
              })) ?? []
            )}
            value={location.pathname.split("/")[2] ?? ""}
            onChange={(value) =>
              navigate(value !== "" ? "/cards/" + value : "/cards")
            }
          />
        </Stack>
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
  const [deck, failed] = useDeckFromUrl();
  const cards = useCardsOf(deck ?? dummyDeck);
  if (failed) {
    return <MissingObject />;
  }
  return <Core cardSet={cards} name={deck?.name ?? ""} />;
}

interface CoreProps {
  cardSet: Card<CardType>[];
  name: string;
}

function Core({ cardSet }: CoreProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedCard, setSelectedCard] = useState<Card<CardType>>();
  return (
    <Group spacing="lg" grow pr="lg" align="start">
      <Stack miw="300px" w="400px" maw="100%">
        <CardTable
          cardSet={cardSet}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
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

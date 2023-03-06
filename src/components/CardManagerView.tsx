import React, { useState } from "react";
import { ActionIcon, Center, Group, Stack, Text } from "@mantine/core";
import { Card, CardType, useCards, useCardsOf } from "../logic/card";
import { useLocation, useNavigate } from "react-router-dom";
import CardTable from "./sidebar/CardTable";
import EditCardView from "./editcard/EditCardView";
import { dummyDeck, useDeckFromUrl } from "../logic/deck";
import MissingObject from "./MissingObject";
import { swapLight } from "../logic/ui";
import { IconChevronLeft } from "@tabler/icons-react";

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
function Core({ cardSet, name }: CoreProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [selectedCard, setSelectedCard] = useState<Card<CardType>>();
  const navigate = useNavigate();
  return (
    <Center>
      <Group spacing="lg" align="start">
        <Stack w="600px">
          <Group>
            <ActionIcon
              onClick={() => {
                navigate(-1);
              }}
            >
              <IconChevronLeft />
            </ActionIcon>
            <Stack spacing={0}>
              <Text
                sx={(theme) => ({
                  color: swapLight(theme),
                  fontSize: theme.fontSizes.sm,
                })}
              >
                Showing cards in
              </Text>
              <Text fw={600}>{name}</Text>
            </Stack>
          </Group>
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

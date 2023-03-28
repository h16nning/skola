import React, { useState } from "react";
import { ActionIcon, Button, Group, Stack, Title } from "@mantine/core";
import SubDeckSection from "./SubDeckSection";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import DeckMenu from "./DeckMenu";
import { useNavigate } from "react-router-dom";
import { useDeckFromUrl, useSuperDecks } from "../../logic/deck";
import DeckOptionsModal from "./DeckOptionsModal";
import MissingObject from "../custom/MissingObject";
import SuperDecksBreadcrumbs from "../SuperDecksBreadcrumbs";
import { useCardsOf, useStatsOf } from "../../logic/card";
import HeroDeckSection from "./HeroDeckSection";
import { useDocumentTitle } from "@mantine/hooks";

function DeckView() {
  const navigate = useNavigate();
  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  const stats = useStatsOf(cards);

  useDocumentTitle(deck?.name ? deck?.name : "Super Anki");
  if (isDeckReady && !deck) {
    return <MissingObject />;
  }
  return (
    <>
      <Stack spacing="4rem" sx={() => ({ width: "600px", maxWidth: "100%" })}>
        <Group position="apart" spacing="xs" align="end">
          <Group
            spacing="xs"
            align="end"
            noWrap
            sx={() => ({ flexBasis: "50%", flexGrow: 2, minWidth: "10rem" })}
          >
            <ActionIcon
              onClick={() =>
                navigate(
                  deck &&
                    deck.superDecks &&
                    deck.superDecks[deck.superDecks.length - 1]
                    ? "/deck/" + deck.superDecks[deck.superDecks.length - 1]
                    : "/home"
                )
              }
            >
              <IconChevronLeft />
            </ActionIcon>
            <Stack
              spacing="0.25rem"
              sx={() => ({
                minWidth: 0,
                whiteSpace: "nowrap",
              })}
            >
              <SuperDecksBreadcrumbs superDecks={superDecks} />
              <Title order={2} truncate>
                {deck ? deck.name : ""}
              </Title>
            </Stack>
          </Group>

          <DeckMenu
            deck={deck}
            isDeckReady={isDeckReady}
            cards={cards}
            areCardsReady={areCardsReady}
            stats={stats}
            setDeckOptionsOpened={setDeckOptionsOpened}
          />
        </Group>

        <Stack spacing="xs" align="end">
          <Button
            leftIcon={<IconPlus />}
            variant="default"
            onClick={() => navigate("/new/" + deck?.id)}
          >
            Add Cards
          </Button>
          <HeroDeckSection
            deck={deck}
            isDeckReady={isDeckReady}
            cards={cards}
            areCardsReady={areCardsReady}
            stats={stats}
          />
        </Stack>

        <SubDeckSection deck={deck} />
        {deck ? (
          <DeckOptionsModal
            deck={deck}
            opened={deckOptionsOpened}
            setOpened={setDeckOptionsOpened}
          />
        ) : (
          ""
        )}
      </Stack>
    </>
  );
}
export default DeckView;

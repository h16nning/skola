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
  const [superDecks, areSuperDecksReady] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  const stats = useStatsOf(cards);

  useDocumentTitle(deck?.name ? deck?.name : "Super Anki");
  if (isDeckReady && !deck) {
    return <MissingObject />;
  }
  return (
    <>
      <Stack spacing="4rem" sx={() => ({ width: "600px" })}>
        <Group spacing="xs" align="end" noWrap>
          <ActionIcon onClick={() => navigate(-1)}>
            <IconChevronLeft />
          </ActionIcon>
          <Stack spacing="0.25rem" w="100%">
            <SuperDecksBreadcrumbs superDecks={superDecks} />
            <Group position="apart" noWrap>
              <Title order={2}>{deck ? deck.name : ""}</Title>
              <Group spacing="xs">
                <Button
                  leftIcon={<IconPlus />}
                  variant="default"
                  onClick={() => navigate("/new/" + deck?.id)}
                >
                  Add Cards
                </Button>
                <DeckMenu
                  deck={deck}
                  isDeckReady={isDeckReady}
                  cards={cards}
                  areCardsReady={areCardsReady}
                  stats={stats}
                  setDeckOptionsOpened={setDeckOptionsOpened}
                />
              </Group>
            </Group>
          </Stack>
        </Group>

        <HeroDeckSection
          deck={deck}
          isDeckReady={isDeckReady}
          cards={cards}
          areCardsReady={areCardsReady}
          stats={stats}
        />

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

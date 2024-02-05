import React, { useState } from "react";
import { ActionIcon, Button, Group, Stack, Title } from "@mantine/core";
import SubDeckSection from "./SubDeckSection";
import { IconChevronLeft, IconPlus } from "@tabler/icons-react";
import DeckMenu from "./DeckMenu";
import { useNavigate } from "react-router-dom";
import { useDeckFromUrl, useSuperDecks } from "../../logic/deck";
import DeckOptionsModal from "./DeckOptionsModal";
import MissingObject from "../custom/MissingObject";
import SuperDecksBreadcrumbs from "../SuperDecksBreadcrumbs/SuperDecksBreadcrumbs";
import { useCardsOf, useStatsOf } from "../../logic/card";
import HeroDeckSection from "./HeroDeckSection/HeroDeckSection";
import { useDocumentTitle } from "@mantine/hooks";
import { useScrollResetOnLocationChange } from "../../logic/ui";

function DeckView() {
  const navigate = useNavigate();
  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  const stats = useStatsOf(cards);

  useScrollResetOnLocationChange();

  useDocumentTitle(deck?.name ? deck?.name : "Super Anki");
  if (isDeckReady && !deck) {
    return <MissingObject />;
  }

  return (
    <>
      <Stack gap="4rem" w="600px" maw="100%">
        <Group justify="space-between" gap="xs" align="end">
          <Group
            gap="xs"
            align="end"
            wrap="nowrap"
            style={{ flexBasis: "50%", flexGrow: 2, minWidth: "10rem" }}
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
              gap="0.25rem"
              miw="0"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              <SuperDecksBreadcrumbs superDecks={superDecks} />
              <Title order={2} lineClamp={1} h="2rem">
                {deck && deck.name}
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

        {deck && deck.description && (
          <div dangerouslySetInnerHTML={{ __html: deck.description }} />
        )}
        <Stack gap="xs" align="end">
          <Button
            leftSection={<IconPlus />}
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

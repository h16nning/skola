import React, { useState } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Title,
  Center,
  useMantineTheme,
  Space,
  Text,
} from "@mantine/core";
import SubDeckSection from "./SubDeckSection";
import { IconPlus } from "@tabler/icons-react";
import DeckMenu from "./DeckMenu";
import { useNavigate } from "react-router-dom";
import { useDeckFromUrl, useSuperDecks } from "../../logic/deck";
import DeckOptionsModal from "./DeckOptionsModal";
import MissingObject from "../custom/MissingObject";
import SuperDecksBreadcrumbs from "../SuperDecksBreadcrumbs/SuperDecksBreadcrumbs";
import { useCardsOf } from "../../logic/card";
import HeroDeckSection from "./HeroDeckSection/HeroDeckSection";
import { useDocumentTitle, useHotkeys } from "@mantine/hooks";
import { useScrollResetOnLocationChange } from "../../logic/ui";
import NotebookView from "../notebook/NotebookView";
import { AppHeaderContent } from "../Header/Header";
import { IconChevronLeft } from "@tabler/icons-react";

function DeckView() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  useScrollResetOnLocationChange();

  useDocumentTitle(deck?.name ? deck?.name : "Skola");
  if (isDeckReady && !deck) {
    return <MissingObject />;
  }

  return (
    <>
      <AppHeaderContent>
        <Group justify="space-between" gap="xs" wrap="nowrap">
          <SuperDecksBreadcrumbs superDecks={superDecks} />
          <DeckMenu
            deck={deck}
            isDeckReady={isDeckReady}
            cards={cards}
            areCardsReady={areCardsReady}
            setDeckOptionsOpened={setDeckOptionsOpened}
          />
        </Group>
      </AppHeaderContent>
      <Stack gap="xs" align="end" w="100%" maw="600px">
        <Group justify="space-between" w="100%">
          <Title
            order={3}
            lineClamp={1}
            c="var(--mantine-primary-color-filled)"
          >
            {deck?.name}
          </Title>
          <Button
            leftSection={<IconPlus />}
            variant="default"
            onClick={() => navigate("/new/" + deck?.id)}
          >
            Add Cards
          </Button>
        </Group>
        <HeroDeckSection
          deck={deck}
          isDeckReady={isDeckReady}
          cards={cards}
          areCardsReady={areCardsReady}
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
        <NotebookView />
      </Stack>
    </>
  );
}
export default DeckView;

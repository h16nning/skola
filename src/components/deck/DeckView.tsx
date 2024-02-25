import {
  Badge,
  Button,
  Group,
  Kbd,
  Stack,
  Tabs,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDocumentTitle, useHotkeys } from "@mantine/hooks";
import { useState } from "react";
import { useCardsOf } from "../../logic/card";
import { useDeckFromUrl, useSuperDecks } from "../../logic/deck";
import { useScrollResetOnLocationChange } from "../../logic/ui";
import { AppHeaderContent } from "../Header/Header";
import SuperDecksBreadcrumbs from "../SuperDecksBreadcrumbs/SuperDecksBreadcrumbs";
import MissingObject from "../custom/MissingObject";
import NotebookView from "../notebook/NotebookView";
import DeckMenu from "./DeckMenu";
import DeckOptionsModal from "./DeckOptionsModal";
import HeroDeckSection from "./HeroDeckSection/HeroDeckSection";
import SubDeckSection from "./SubDeckSection";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

function DeckView() {
  const navigate = useNavigate();

  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  useScrollResetOnLocationChange();

  useDocumentTitle(deck?.name ? deck?.name : "Skola");
  if (isDeckReady && !deck) {
    return <MissingObject />;
  }

  useHotkeys([["n", () => navigate("/new/" + deck?.id)]]);

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
      <Stack gap="xl" align="start" w="100%" maw="600px" pt="lg">
        <Group justify="space-between" align="center" w="100%">
          <Title order={3} lineClamp={1}>
            {deck?.name}
          </Title>
          <Tooltip
            label={
              <>
                {t("deck.add-cards-tooltip")}
                <Kbd>n</Kbd>
              </>
            }
          >
            <Button
              leftSection={<IconPlus />}
              variant="default"
              onClick={() => navigate("/new/" + deck?.id)}
            >
              {t("deck.add-cards")}
            </Button>
          </Tooltip>
        </Group>
        <HeroDeckSection
          deck={deck}
          isDeckReady={isDeckReady}
          cards={cards}
          areCardsReady={areCardsReady}
        />

        <Tabs defaultValue={"notebook"} w="100%" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="notebook">
              {t("deck.notebook.title")}
              <Badge
                size="xs"
                circle
                ml={"sm"}
                variant="light"
                color={cards?.length ? undefined : "gray"}
              >
                {areCardsReady ? cards?.length : "-"}
              </Badge>
            </Tabs.Tab>
            <Tabs.Tab value="subdecks">
              {t("deck.subdeck.title")}
              <Badge
                size="xs"
                circle
                ml={"sm"}
                variant="light"
                color={deck?.subDecks.length ? undefined : "gray"}
              >
                {deck?.subDecks.length}
              </Badge>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="notebook">
            <NotebookView />
          </Tabs.Panel>
          <Tabs.Panel value="subdecks">
            <SubDeckSection deck={deck} />
          </Tabs.Panel>
        </Tabs>
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

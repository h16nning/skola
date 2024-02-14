import { Group, Stack, Tabs, Title } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
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

function DeckView() {
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
      <Stack gap="xl" align="start" w="100%" maw="600px" pt="lg">
        <Title order={3} lineClamp={1}>
          {deck?.name}
        </Title>
        <HeroDeckSection
          deck={deck}
          isDeckReady={isDeckReady}
          cards={cards}
          areCardsReady={areCardsReady}
        />

        <Tabs defaultValue={"subdecks"} w="100%" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="subdecks">{t("deck.subdeck.title")}</Tabs.Tab>
            <Tabs.Tab value="notebook">{t("deck.notebook.title")}</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="subdecks">
            <SubDeckSection deck={deck} />
          </Tabs.Panel>
          <Tabs.Panel value="notebook">
            <NotebookView />
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

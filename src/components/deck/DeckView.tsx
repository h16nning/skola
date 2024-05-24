import { Badge, Group, Stack, Tabs } from "@mantine/core";
import { useDocumentTitle, useHotkeys } from "@mantine/hooks";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import TitleSection from "./TitleSection";

function DeckView() {
  const navigate = useNavigate();

  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  useScrollResetOnLocationChange();

  useDocumentTitle(deck?.name ? deck?.name : "Skola");
  useHotkeys([["n", () => navigate("/new/" + deck?.id)]]);

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
        <TitleSection deck={deck} />
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
                ml={"sm"}
                variant="light"
                color={cards?.length ? undefined : "gray"}
                style={{ textOverflow: "clip" }}
              >
                {areCardsReady ? cards?.length : "-"}
              </Badge>
            </Tabs.Tab>
            <Tabs.Tab value="subdecks">
              {t("deck.subdeck.title")}
              <Badge
                size="xs"
                ml={"sm"}
                variant="light"
                color={deck?.subDecks.length ? undefined : "gray"}
                style={{ textOverflow: "clip" }}
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

import MissingObject from "@/components/MissingObject";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useScrollResetOnLocationChange } from "@/lib/ui";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useSuperDecks } from "@/logic/deck/hooks/useSuperDecks";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotebookView from "../notebook/NotebookView";
import { AppHeaderContent } from "../shell/Header/Header";
import DeckMenu from "./DeckMenu";
import DeckOptionsModal from "./DeckOptionsModal";
import "./DeckView.css";
import HeroDeckSection from "./HeroDeckSection/HeroDeckSection";
import SubDeckSection from "./SubDeckSection";
import SuperDecksBreadcrumbs from "./SuperDecksBreadcrumbs/SuperDecksBreadcrumbs";
import TitleSection from "./TitleSection";

const BASE_URL = "deck-view";

function DeckView() {
  const navigate = useNavigate();

  const [deckOptionsOpened, setDeckOptionsOpened] = useState(false);

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  useScrollResetOnLocationChange();

  useDocumentTitle(deck?.name ? deck?.name : "Skola");
  useHotkeys([["n", () => navigate("/new/" + deck?.id)]]);

  if (isDeckReady && !deck) {
    return <MissingObject />;
  }

  return (
    <>
      <AppHeaderContent>
        <div className={`${BASE_URL}__header`}>
          <SuperDecksBreadcrumbs superDecks={superDecks} />
          <DeckMenu
            deck={deck}
            isDeckReady={isDeckReady}
            setDeckOptionsOpened={setDeckOptionsOpened}
          />
        </div>
      </AppHeaderContent>
      <div className={BASE_URL}>
        <TitleSection deck={deck} />
        <HeroDeckSection deck={deck} isDeckReady={isDeckReady} />

        <Tabs defaultValue="subdecks" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="subdecks">
              {t("deck.subdeck.title")}
              {(deck?.subDecks.length as number) > 0 && (
                <Badge
                  size="sm"
                  variant="light"
                  color={deck?.subDecks.length ? undefined : "gray"}
                  style={{ textOverflow: "clip" }}
                >
                  {deck?.subDecks.length}
                </Badge>
              )}
            </Tabs.Tab>
            <Tabs.Tab value="notebook">
              {t("deck.notebook.title")}
              {(deck?.notes.length as number) > 0 && (
                <Badge
                  size="sm"
                  variant="light"
                  color={deck?.notes.length ? undefined : "gray"}
                  style={{ textOverflow: "clip" }}
                >
                  {deck?.notes.length}
                </Badge>
              )}
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
      </div>
    </>
  );
}
export default DeckView;

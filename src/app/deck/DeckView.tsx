import { AppBreadcrumbs, BreadcrumbSegment } from "@/components/AppBreadcrumbs";
import NotFound from "@/components/NotFound";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useScrollResetOnLocationChange } from "@/lib/ui";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useSuperDecks } from "@/logic/deck/hooks/useSuperDecks";
import { IconPlus } from "@tabler/icons-react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import NotebookView from "../notebook/NotebookView";
import { AppHeaderContent } from "../shell/Header/Header";
import DeckMenu from "./DeckMenu";
import "./DeckView.css";
import { useCardStateCounts } from "@/logic/card/hooks/useCardStateCounts";
import { useCardsOf } from "@/logic/card/hooks/useCardsOf";
import DeckHeroSection from "./DeckHeroSection/DeckHeroSection";
import SubDeckSection from "./SubDeckSection";

const BASE = "deck-view";

function DeckView() {
  const navigate = useNavigate();

  const [deck, isDeckReady] = useDeckFromUrl();
  const [superDecks] = useSuperDecks(deck);
  const [cards, areCardsReady] = useCardsOf(deck);
  const [states, areStatesReady] = useCardStateCounts(deck);

  useScrollResetOnLocationChange();

  useDocumentTitle(deck?.name ? deck?.name : "Skola");
  useHotkeys([["n", () => navigate("/new/" + deck?.id)]]);

  const ready = isDeckReady && areCardsReady && areStatesReady;

  if (isDeckReady && !deck) {
    return <NotFound />;
  }

  const breadcrumbSegments: BreadcrumbSegment[] = [
    ...(superDecks?.map((superDeck) => ({
      label: superDeck.name,
      path: `/deck/${superDeck.id}`,
    })) || []),
    ...(deck ? [{ label: deck.name, path: `/deck/${deck.id}` }] : []),
  ];

  return (
    <>
      <AppHeaderContent>
        <div className={`${BASE}__header`}>
          <div style={{ flexGrow: 2, minWidth: 0 }}>
            <AppBreadcrumbs segments={breadcrumbSegments} />
          </div>
          <div className={`${BASE}__actions`}>
            <Tooltip
              position="left"
              label={
                <>
                  {t("deck.add-cards-tooltip")}
                  <Kbd>n</Kbd>
                </>
              }
            >
              <Button
                leftSection={<IconPlus />}
                variant="ghost"
                onClick={() => navigate("/new/" + deck?.id)}
              >
                {t("deck.add-cards")}
              </Button>
            </Tooltip>
            {ready && <DeckMenu deck={deck} />}
          </div>
        </div>
      </AppHeaderContent>
      {ready && states && (
        <div className={BASE}>
          <DeckHeroSection deck={deck} cards={cards} states={states} />
          <Tabs defaultValue="subdecks" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="subdecks">
                {t("deck.subdeck.title")}
                {(deck?.subDecks.length as number) > 0 && (
                  <Badge
                    size="sm"
                    variant="light"
                    color={deck?.subDecks.length ? undefined : "neutral"}
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
                    color={deck?.notes.length ? undefined : "neutral"}
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
        </div>
      )}
    </>
  );
}
export default DeckView;

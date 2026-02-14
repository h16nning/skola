import { AppBreadcrumbs } from "@/components/AppBreadcrumbs";
import EmptyNotice from "@/components/EmptyNotice";
import { Button, Kbd, Tooltip } from "@/components/ui";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useTopLevelDecks } from "@/logic/deck/hooks/useTopLevelDecks";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DeckModal from "../deck/DeckModal";
import DeckTable from "../deck/DeckTable";
import { AppHeaderContent } from "../shell/Header/Header";
import "./HomeView.css";

const BASE = "home-view";

export default function HomeView() {
  useDocumentTitle("Skola");
  const [t] = useTranslation();
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [decks, isReady] = useTopLevelDecks();
  const [userName, userNameIsReady] = useSetting("#name");

  useHotkeys([["n", () => setNewDeckModalOpened(true)]]);

  return (
    <>
      <AppHeaderContent>
        <AppBreadcrumbs />
        <Tooltip
          label={
            <>
              {t("deck.create-deck-tooltip")}
              <Kbd>n</Kbd>
            </>
          }
          position="left"
        >
          <Button
            onClick={() => setNewDeckModalOpened(true)}
            leftSection={<IconPlus />}
            variant="ghost"
          >
            {t("deck.new-deck-button")}
          </Button>
        </Tooltip>
      </AppHeaderContent>

      <div className={`${BASE}__content`}>
        <section className={`${BASE}__welcome-section`}>
          <h1
            className={`${BASE}__welcome-title ${!userNameIsReady && "invisible"}`}
          >
            {userName
              ? t("home.welcome-user", { name: userName })
              : t("home.welcome")}
          </h1>
          <sub className={`${BASE}__welcome-subtitle`}>
            {t("home.welcome-subtitle")}
          </sub>
        </section>
        {isReady && decks?.length === 0 ? (
          <div className={`${BASE}__empty-state`}>
            <EmptyNotice
              icon={IconFolder}
              description={t("home.no-decks-found")}
            />
            <Button
              onClick={() => setNewDeckModalOpened(true)}
              leftSection={<IconPlus />}
              variant="primary"
              autoFocus
            >
              {t("deck.new-deck-button")}
            </Button>
          </div>
        ) : (
          <DeckTable deckList={decks} isReady={isReady} />
        )}
      </div>
      <DeckModal
        mode="create"
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

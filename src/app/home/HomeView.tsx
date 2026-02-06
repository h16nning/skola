import AppHeaderTitle from "@/components/AppHeaderTitle/AppHeaderTitle";
import EmptyNotice from "@/components/EmptyNotice";
import { Button, Kbd, Tooltip } from "@/components/ui";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useTopLevelDecks } from "@/logic/deck/hooks/useTopLevelDecks";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DeckTable from "../deck/DeckTable";
import NewDeckModal from "../deck/NewDeckModal";
import { AppHeaderContent } from "../shell/Header/Header";
import "./HomeView.css";

const BASE_URL = "home-view";

export default function HomeView() {
  useDocumentTitle("Skola");
  const [t] = useTranslation();
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [decks, isReady] = useTopLevelDecks();
  const [userName] = useSetting("name");

  useHotkeys([["n", () => setNewDeckModalOpened(true)]]);

  return (
    <>
      <AppHeaderContent>
        <AppHeaderTitle>
          {userName
            ? t("home.welcome-user", { name: userName })
            : t("home.welcome")}
        </AppHeaderTitle>
      </AppHeaderContent>

      {isReady && decks?.length === 0 ? (
        <div className={`${BASE_URL}__empty-state`}>
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
        <div className={`${BASE_URL}__content`}>
          <Tooltip
            label={
              <>
                {t("deck.create-deck-tooltip")}
                <Kbd>n</Kbd>
              </>
            }
          >
            <Button
              onClick={() => setNewDeckModalOpened(true)}
              leftSection={<IconPlus />}
              variant="default"
            >
              {t("deck.new-deck-button")}
            </Button>
          </Tooltip>
          <DeckTable deckList={decks} isReady={isReady} />
        </div>
      )}
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

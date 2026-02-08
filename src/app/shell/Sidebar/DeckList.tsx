import NewDeckModal from "@/app/deck/NewDeckModal";
import { breakpoints } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTopLevelDecks } from "@/logic/deck/hooks/useTopLevelDecks";
import { IconPlus } from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import "./DeckList.css";
import DeckTree from "./DeckTree";

const BASE = "deck-list";

interface DeckListProps {
  minimalMode: boolean;
}

export default function DeckList({ minimalMode }: DeckListProps) {
  const [decks, isReady] = useTopLevelDecks();
  const isSmOrLarger = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);

  if (!isSmOrLarger || minimalMode) {
    return null;
  }

  return (
    <section className={BASE}>
      <h2 className={`${BASE}__title`}>{t("sidebar.decks-title")}</h2>

      <div className={`${BASE}__items`}>
        {isReady &&
          decks?.map((deck) => <DeckTree deck={deck} key={deck.id} />)}

        <button
          type="button"
          className={`${BASE}__add-button`}
          onClick={() => setNewDeckModalOpened(true)}
        >
          <IconPlus size={16} />
          <span>{t("sidebar.decks-add")}</span>
        </button>
      </div>

      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </section>
  );
}

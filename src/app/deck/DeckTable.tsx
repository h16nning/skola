import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Deck } from "@/logic/deck/deck";
import DeckPreview from "./DeckPreview";

import EmptyNotice from "@/components/EmptyNotice";
import { IconCards } from "@tabler/icons-react";
import "./DeckTable.css";
import { useHotkeys } from "@/lib/hooks/useHotkeys";

interface DeckTableProps {
  deckList?: Deck[];
  isReady: boolean;
}

const BASE = "deck-table";

function DeckTable({ deckList, isReady }: DeckTableProps) {
  const [t] = useTranslation();

  const navigate = useNavigate();
  useHotkeys(
    deckList
      ?.slice(0, 9)
      .map((d, i) => [(i + 1).toString(), () => navigate(`/deck/${d.id}`)]) ??
      []
  );

  return isReady && deckList ? (
    deckList.length !== 0 ? (
      <div className={BASE}>
        {deckList
          .sort((a: Deck, b: Deck) => a.name.localeCompare(b.name))
          .map((deck, index) => (
            <DeckPreview key={deck.id} deck={deck} i={index} />
          ))}
      </div>
    ) : (
      <EmptyNotice icon={IconCards} title={t("home.no-decks-found")} />
    )
  ) : (
    <span>Loading...</span>
  );
}

export default DeckTable;

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconCards, IconChevronRight } from "@tabler/icons-react";
import { Deck } from "@/logic/deck/deck";
import { useSubDecks } from "@/logic/deck/hooks/useSubDecks";
import "./DeckTree.css";

const BASE = "deck-tree";

interface DeckTreeProps {
  deck: Deck;
  level?: number;
}

function DeckTree({ deck: parentDeck, level = 0 }: DeckTreeProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [decks, isReady] = useSubDecks(parentDeck);
  const navigate = useNavigate();
  const location = useLocation();

  const hasSubDecks = parentDeck.subDecks.length > 0;
  const isActive = location.pathname === `/deck/${parentDeck.id}`;

  if (!isReady || !decks) {
    return null;
  }

  const itemClasses = [BASE, isActive && `${BASE}--active`]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    navigate(`/deck/${parentDeck.id}`);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpened(!isOpened);
  };

  return (
    <div className={`${BASE}__container`}>
      <button
        type="button"
        className={itemClasses}
        onClick={handleClick}
        style={{ paddingLeft: `calc(var(--spacing-md) + ${level * 0.75}rem)` }}
      >
        <span className={`${BASE}__icon`}>
          <IconCards size={16} stroke={1.5} />
        </span>
        <span className={`${BASE}__label`}>{parentDeck.name}</span>
        {hasSubDecks && (
          <button
            type="button"
            className={`${BASE}__toggle ${isOpened ? `${BASE}__toggle--open` : ""}`}
            onClick={handleToggle}
            aria-label={isOpened ? "Collapse" : "Expand"}
          >
            <IconChevronRight size={14} stroke={1.5} />
          </button>
        )}
      </button>

      {hasSubDecks && isOpened && (
        <div className={`${BASE}__children`}>
          {decks.map((deck) => (
            <DeckTree deck={deck} key={deck.id} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckTree;

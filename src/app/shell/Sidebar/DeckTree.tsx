import { IconButton } from "@/components/ui/IconButton";
import { NavItem } from "@/components/ui/NavItem";
import { Deck } from "@/logic/deck/deck";
import { useSubDecks } from "@/logic/deck/hooks/useSubDecks";
import { IconCards, IconChevronRight, IconDots } from "@tabler/icons-react";
import { memo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DeckTree.css";
import DeckMenu from "@/app/deck/DeckMenu";

const BASE = "deck-tree";

interface DeckTreeProps {
  deck: Deck;
  level?: number;
}

function DeckTree({ deck: parentDeck, level = 0 }: DeckTreeProps) {
  const [decks, isReady] = useSubDecks(parentDeck);

  if (!isReady || !decks) {
    return null;
  }

  return <DeckTreeItem deck={parentDeck} subDecks={decks} level={level} />;
}

export default DeckTree;

const DeckTreeItem = memo(
  ({
    deck,
    subDecks,
    level,
  }: { deck: Deck; subDecks: Deck[]; level: number }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [hasHovered, setHasHovered] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const hasSubDecks = deck.subDecks.length > 0;
    const isActive = location.pathname === `/deck/${deck.id}`;

    const handleClick = () => {
      navigate(`/deck/${deck.id}`);
    };

    const handleToggle = () => {
      setIsOpened(!isOpened);
    };

    const expandButton = hasSubDecks ? (
      <button
        type="button"
        className={`${BASE}__toggle ${isOpened ? `${BASE}__toggle--open` : ""}`}
        onClick={handleToggle}
        aria-label={isOpened ? "Collapse" : "Expand"}
      >
        <IconChevronRight size={14} stroke={1.5} />
      </button>
    ) : undefined;

    return (
      <div className={`${BASE}__container`}>
        <NavItem
          label={deck.name}
          icon={<IconCards size={16} stroke={1.5} />}
          onClick={handleClick}
          active={isActive}
          indent={level}
          rightElement={
            <>
              {hasHovered ? (
                <DeckMenu
                  deck={deck}
                  ready={true}
                  triggerSize="sm"
                  withShortcuts={false}
                />
              ) : (
                <IconButton
                  variant="subtle"
                  size="sm"
                  aria-label="Menu"
                  onMouseEnter={() => setHasHovered(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasHovered(true);
                  }}
                >
                  <IconDots />
                </IconButton>
              )}
              {expandButton}
            </>
          }
        />

        {hasSubDecks && isOpened && (
          <div className={`${BASE}__children`}>
            {subDecks.map((subDeck) => (
              <DeckTree deck={subDeck} key={subDeck.id} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

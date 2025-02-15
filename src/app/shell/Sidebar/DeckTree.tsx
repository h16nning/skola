import { Deck } from "@/logic/deck/deck";
import { useSubDecks } from "@/logic/deck/hooks/useSubDecks";
import { NavLink } from "@mantine/core";
import { IconCards, IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DeckTree({ deck: parentDeck }: { deck: Deck }) {
  const [isOpened, setIsOpened] = useState(false);
  const [decks, isReady] = useSubDecks(parentDeck);
  const navigate = useNavigate();
  const location = useLocation();
  const hasSubDecks = parentDeck.subDecks.length > 0;
  if (!isReady || !decks) {
    return;
  }

  return (
    <NavLink
      label={parentDeck.name}
      leftSection={<IconCards size="1rem" stroke={1.5} />}
      childrenOffset={"sm"}
      active={location.pathname === `/deck/${parentDeck.id}`}
      opened={isOpened}
      onClick={() => {
        navigate(`/deck/${parentDeck.id}`);
      }}
      variant="subtle"
      rightSection={
        hasSubDecks && (
          <IconChevronRight
            onClick={(e) => {
              e.stopPropagation();
              setIsOpened(!isOpened);
            }}
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        )
      }
    >
      {hasSubDecks &&
        decks.map((deck) => {
          return <DeckTree deck={deck} key={deck.id} />;
        })}
    </NavLink>
  );
}
export default DeckTree;

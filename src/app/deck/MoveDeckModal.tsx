import { successfullyMovedCardTo } from "@/components/Notification/Notification";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";
import { Modal } from "@/components/ui/Modal";
import { Deck } from "@/logic/deck/deck";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { moveDeck } from "@/logic/deck/moveDeck";
import { IconArrowsExchange, IconNotes } from "@tabler/icons-react";
import { useState } from "react";
import "./MoveDeckModal.css";
import EmptyNotice from "@/components/EmptyNotice";

const BASE_URL = "move-deck-modal";

interface MoveDeckModalProps {
  deck: Deck;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function MoveDeckModal({
  deck,
  opened,
  setOpened,
}: MoveDeckModalProps) {
  const oldSuperDeck = deck.superDecks
    ? deck.superDecks[deck.superDecks.length - 1]
    : null;

  const [decks, areDecksReady] = useDecks((decks) =>
    decks?.filter((d) => d.id !== oldSuperDeck)
  );
  const [newDeckID, setNewDeckID] = useState<string | null>(null);

  const handleMove = () => {
    const newDeck = decks?.find((deck) => deck.id === newDeckID);
    if (newDeck !== undefined) {
      moveDeck(deck.id, newDeck.id);
      successfullyMovedCardTo(newDeck.name);
      setOpened(false);
    }
  };

  const isValidSelection =
    areDecksReady && newDeckID && newDeckID !== oldSuperDeck;

  return (
    <Modal title="Move Deck" opened={opened} onClose={() => setOpened(false)}>
      <div className={`${BASE_URL}__content`}>
        {decks?.length! > 1 ? (
          <Combobox
            searchable
            label="Move To"
            nothingFoundMessage="No Decks Found"
            disabled={!areDecksReady}
            data={
              decks?.map((deck) => ({
                value: deck.id,
                label: deck.name,
              })) ?? []
            }
            value={newDeckID}
            onChange={(value: string | null) => {
              setNewDeckID(value);
            }}
          />
        ) : (
          <EmptyNotice
            icon={IconNotes}
            title="You have just this one deck."
            description="It seems like there are no other valid decks to move this deck to. Try creating another one."
          />
        )}
        <div className={`${BASE_URL}__actions`}>
          <Button
            onClick={handleMove}
            leftSection={<IconArrowsExchange />}
            disabled={!isValidSelection}
            variant="primary"
          >
            Move Deck
          </Button>
        </div>
      </div>
    </Modal>
  );
}

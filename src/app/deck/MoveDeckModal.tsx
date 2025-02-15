import { successfullyMovedCardTo } from "@/components/Notification/Notification";
import { Deck } from "@/logic/deck/deck";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { moveDeck } from "@/logic/deck/moveDeck";
import { Button, Group, Modal, Select, Stack, Text } from "@mantine/core";
import { IconArrowsExchange } from "@tabler/icons-react";
import { useState } from "react";

interface MoveDeckModalProps {
  deck: Deck;
  opened: boolean;
  setOpened: Function;
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

  return (
    <Modal title={"Move Deck"} opened={opened} onClose={() => setOpened(false)}>
      <Stack>
        <Select
          searchable
          label="Move To"
          nothingFoundMessage="No Decks Found"
          disabled={!areDecksReady}
          //withinPortal
          data={
            decks?.map((deck) => ({
              value: deck.id,
              label: deck.name,
            })) ?? []
          }
          value={newDeckID}
          onChange={(value) => {
            setNewDeckID(value);
          }}
        />
        {decks?.length === 0 && (
          <Text fz="sm">
            It seems like there are no other valid decks to move this deck to.
            Try creating another one.
          </Text>
        )}
        <Group justify="flex-end">
          <Button
            onClick={() => {
              const newDeck = decks?.find((deck) => deck.id === newDeckID);
              if (newDeck !== undefined) {
                moveDeck(deck.id, newDeck.id);
                successfullyMovedCardTo(newDeck.name);
                setOpened(false);
              } else {
              }
            }}
            leftSection={<IconArrowsExchange />}
            disabled={
              !areDecksReady || !newDeckID || newDeckID === oldSuperDeck
            }
          >
            Move Deck
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

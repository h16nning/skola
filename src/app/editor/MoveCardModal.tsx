import { successfullyMovedCardTo } from "@/components/Notification/Notification";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";
import { Group } from "@/components/ui/Group";
import { Modal } from "@/components/ui/Modal";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { Card } from "@/logic/card/card";
import { moveCard } from "@/logic/card/moveCard";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { NoteType } from "@/logic/note/note";
import { IconArrowsExchange } from "@tabler/icons-react";
import { useState } from "react";

interface MoveCardModalProps {
  card: Card<NoteType>;
  opened: boolean;
  setOpened: Function;
}

export default function MoveCardModal({
  card,
  opened,
  setOpened,
}: MoveCardModalProps) {
  const [decks, areDecksReady] = useDecks((decks) =>
    decks?.filter((deck) => deck.id !== card.deck)
  );
  const [newDeckID, setNewDeckID] = useState<string | null>(null);

  return (
    <Modal title="Move" opened={opened} onClose={() => setOpened(false)}>
      <Stack gap="md">
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
          onChange={(value) => {
            setNewDeckID(value);
          }}
        />
        {decks?.length === 0 && (
          <Text size="sm">
            It seems like there are no other valid decks to move this card to.
            Try creating another one.
          </Text>
        )}
        <Group justify="end">
          <Button
            onClick={() => {
              const newDeck = decks?.find((deck) => deck.id === newDeckID);
              if (newDeck !== undefined) {
                moveCard(card, newDeck);
                successfullyMovedCardTo(newDeck.name);
                setOpened(false);
              }
            }}
            leftSection={<IconArrowsExchange />}
            disabled={!areDecksReady || !newDeckID || newDeckID === card.deck}
          >
            Move Card
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

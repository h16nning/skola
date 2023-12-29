import React, { useState } from "react";
import { Card, CardType, moveCard } from "../../logic/card";
import { Button, Group, Modal, Select, Stack, Text } from "@mantine/core";
import { getUtils } from "../../logic/CardTypeManager";
import { useDecks } from "../../logic/deck";
import { IconArrowsExchange, IconArrowsMove } from "@tabler/icons-react";
import { successfullyMovedTo } from "../custom/Notification/Notification";

interface MoveCardModalProps {
  card: Card<CardType>;
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
    <Modal
      title={`Move “${getUtils(card).displayPreview(card)}“ `}
      opened={opened}
      onClose={() => setOpened(false)}
    >
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
            It seems like there are no other valid decks to move this card to.
            Try creating another one.
          </Text>
        )}
        <Group justify="flex-end">
          <Button
            onClick={() => {
              const newDeck = decks?.find((deck) => deck.id === newDeckID);
              if (newDeck !== undefined) {
                moveCard(card, newDeck);
                successfullyMovedTo(newDeck.name);
                setOpened(false);
              } else {
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

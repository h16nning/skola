import { successfullyMovedNoteTo } from "@/components/Notification/Notification";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";
import { Group } from "@/components/ui/Group";
import { Modal } from "@/components/ui/Modal";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { moveNote } from "@/logic/note/moveNote";
import { Note, NoteType } from "@/logic/note/note";
import { IconArrowsExchange } from "@tabler/icons-react";
import { useState } from "react";

interface MoveNoteModalProps {
  note: Note<NoteType>;
  opened: boolean;
  setOpened: Function;
}

export default function MoveNoteModal({
  note,
  opened,
  setOpened,
}: MoveNoteModalProps) {
  const [decks, areDecksReady] = useDecks((decks) =>
    decks?.filter((deck) => deck.id !== note.deck)
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
            It seems like there are no other valid decks to move this note to.
            Try creating another one.
          </Text>
        )}
        <Group justify="end">
          <Button
            onClick={() => {
              const newDeck = decks?.find((deck) => deck.id === newDeckID);
              if (newDeck !== undefined) {
                moveNote({ note, newDeck });
                successfullyMovedNoteTo(newDeck.name);
                setOpened(false);
              }
            }}
            leftSection={<IconArrowsExchange />}
            disabled={!areDecksReady || !newDeckID || newDeckID === note.deck}
          >
            Move Note
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

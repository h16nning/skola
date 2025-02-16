import { successfullyMovedNoteTo } from "@/components/Notification/Notification";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { moveNote } from "@/logic/note/moveNote";
import { Note, NoteType } from "@/logic/note/note";
import { Button, Group, Modal, Select, Stack, Text } from "@mantine/core";
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
    <Modal title={"Move"} opened={opened} onClose={() => setOpened(false)}>
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
            It seems like there are no other valid decks to move this note to.
            Try creating another one.
          </Text>
        )}
        <Group justify="flex-end">
          <Button
            onClick={() => {
              const newDeck = decks?.find((deck) => deck.id === newDeckID);
              if (newDeck !== undefined) {
                moveNote({ note, newDeck });
                successfullyMovedNoteTo(newDeck.name);
                setOpened(false);
              } else {
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

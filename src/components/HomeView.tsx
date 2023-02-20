import { Button, Center, Group, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";
import NewDeckModal from "./deck/NewDeckModal";
import DeckTable from "./deck/DeckTable";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../logic/db";
import { useDecks } from "../logic/deck";

export default function HomeView() {
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const decks = useDecks();

  return (
    <>
      <Center>
        <Stack spacing="md" sx={{ width: "600px" }}>
          <Group position="right">
            <Button
              onClick={() => setNewDeckModalOpened(true)}
              variant="default"
              leftIcon={<IconPlus />}
            >
              New Deck
            </Button>
          </Group>
          <DeckTable deckList={decks ? decks : []} />
        </Stack>
      </Center>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

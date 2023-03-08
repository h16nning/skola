import { Button, Center, Group, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import NewDeckModal from "./deck/NewDeckModal";
import DeckTable from "./deck/DeckTable";
import { useTopLevelDecks } from "../logic/deck";

export default function HomeView() {
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const decks = useTopLevelDecks();

  return (
    <>
      <Center pt="md">
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

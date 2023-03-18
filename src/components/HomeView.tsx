import { Button, Group, Space, Stack, Title } from "@mantine/core";
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
      <Stack spacing="0" sx={{ width: "600px" }}>
        <Group position="apart">
          <Title order={3}>Welcome back!</Title>
          <Button
            onClick={() => setNewDeckModalOpened(true)}
            variant="default"
            leftIcon={<IconPlus />}
          >
            New Deck
          </Button>
        </Group>
        <Space h="3rem" />
        <DeckTable deckList={decks ? decks : []} />
      </Stack>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

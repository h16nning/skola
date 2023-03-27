import { Button, Group, Space, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import NewDeckModal from "./deck/NewDeckModal";
import DeckTable from "./deck/DeckTable";
import { useTopLevelDecks } from "../logic/deck";
import { useSetting } from "../logic/Settings";

export default function HomeView() {
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [decks, isReady] = useTopLevelDecks();

  const [userName] = useSetting("name");

  return (
    <>
      <Stack spacing="0" sx={{ width: "600px" }}>
        <Group position="apart">
          <Title order={3}>Welcome back{userName && `, ${userName}`}!</Title>
          <Button
            onClick={() => setNewDeckModalOpened(true)}
            variant="default"
            leftIcon={<IconPlus />}
          >
            New Deck
          </Button>
        </Group>
        <Space h="1.5rem" />
        <DeckTable deckList={decks} isReady={isReady} />
      </Stack>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

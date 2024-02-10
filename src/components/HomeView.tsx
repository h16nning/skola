import { Button, Center, Stack, Title } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetting } from "../logic/Settings";
import { useTopLevelDecks } from "../logic/deck";
import { AppHeaderContent } from "./Header/Header";
import DeckTable from "./deck/DeckTable";
import NewDeckModal from "./deck/NewDeckModal";

export default function HomeView({}: {}) {
  const [t] = useTranslation();
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [decks, isReady] = useTopLevelDecks();
  const [userName] = useSetting("name");

  useHotkeys([["n", () => setNewDeckModalOpened(true)]]);

  return (
    <>
      <AppHeaderContent>
        <Center>
          <Title order={3}>
            {userName
              ? t("home.welcome-user", { name: userName })
              : t("home.welcome")}
          </Title>
        </Center>
      </AppHeaderContent>

      <Stack gap="xs" w="600px" maw="100%" align="flex-end" pt="xl">
        <Button
          onClick={() => setNewDeckModalOpened(true)}
          leftSection={<IconPlus />}
          variant="default"
        >
          {t("deck.new-deck-button")}
        </Button>
        <DeckTable deckList={decks} isReady={isReady} />
      </Stack>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

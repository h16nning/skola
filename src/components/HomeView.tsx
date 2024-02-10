import {
  ActionIcon,
  Button,
  Center,
  Group,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import NewDeckModal from "./deck/NewDeckModal";
import DeckTable from "./deck/DeckTable";
import { useTopLevelDecks } from "../logic/deck";
import { useSetting } from "../logic/Settings";
import { useHotkeys } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { AppHeaderContent } from "./Header/Header";

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

      <Stack gap="4rem" w="600px" maw="100%" align="flex-end">
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

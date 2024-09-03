import { Button, Center, Kbd, Stack, Title, Tooltip } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetting } from "../logic/Settings";
import { useTopLevelDecks } from "../logic/deck";
import EmptyNotice from "./EmptyNotice";
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

      {isReady && decks?.length === 0 ? (
        <Stack align="center" p="xl" gap="xl">
          <EmptyNotice
            icon={IconFolder}
            description={t("home.no-decks-found")}
          />
          <Button
            onClick={() => setNewDeckModalOpened(true)}
            leftSection={<IconPlus />}
            variant="primary"
            autoFocus
          >
            {t("deck.new-deck-button")}
          </Button>
        </Stack>
      ) : (
        <Stack gap="xs" w="600px" maw="100%" align="flex-end" pt="xl">
          <Tooltip
            label={
              <>
                {t("deck.create-deck-tooltip")}
                <Kbd>n</Kbd>
              </>
            }
          >
            <Button
              onClick={() => setNewDeckModalOpened(true)}
              leftSection={<IconPlus />}
              variant="default"
            >
              {t("deck.new-deck-button")}
            </Button>
          </Tooltip>
          <DeckTable deckList={decks} isReady={isReady} />
        </Stack>
      )}
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconMenu2, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import NewDeckModal from "./deck/NewDeckModal";
import DeckTable from "./deck/DeckTable";
import { useTopLevelDecks } from "../logic/deck";
import { useSetting } from "../logic/Settings";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

export default function HomeView({
  setMenuOpened,
}: {
  menuOpened: boolean;
  setMenuOpened: Function;
}) {
  const theme = useMantineTheme();
  const [t] = useTranslation();
  const hasSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [decks, isReady] = useTopLevelDecks();
  const [userName] = useSetting("name");

  useHotkeys([["n", () => setNewDeckModalOpened(true)]]);

  return (
    <>
      <Stack gap="3rem" pt="lg" w="600px">
        <Group>
          {hasSmallScreen && (
            <ActionIcon onClick={() => setMenuOpened(true)}>
              <IconMenu2 />
            </ActionIcon>
          )}
          <Title order={3}>
            {userName
              ? t("home.welcome-user", { name: userName })
              : t("home.welcome")}
          </Title>
        </Group>

        <Stack gap="sm" align="flex-end" w="100%">
          <Button
            onClick={() => setNewDeckModalOpened(true)}
            leftSection={<IconPlus />}
            variant="default"
            style={{ alignSelf: "align-end" }}
          >
            {t("deck.new-deck-button")}
          </Button>
          <DeckTable deckList={decks} isReady={isReady} />
        </Stack>
      </Stack>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

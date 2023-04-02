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
import { useMediaQuery } from "@mantine/hooks";
import { testSM2 } from "../logic/SpacedRepetition";

export default function HomeView({
  menuOpened,
  setMenuOpened,
}: {
  menuOpened: boolean;
  setMenuOpened: Function;
}) {
  const theme = useMantineTheme();
  const hasSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [decks, isReady] = useTopLevelDecks();

  const [userName] = useSetting("name");

  return (
    <>
      <Stack spacing="3rem" sx={{ width: "600px" }}>
        <Group>
          {hasSmallScreen && (
            <ActionIcon onClick={() => setMenuOpened(true)}>
              <IconMenu2 />
            </ActionIcon>
          )}
          <Title order={3}>Welcome back{userName && `, ${userName}`}!</Title>
        </Group>

        <Stack spacing="sm">
          <Button
            onClick={() => setNewDeckModalOpened(true)}
            leftIcon={<IconPlus />}
            variant="default"
            sx={() => ({ alignSelf: "end" })}
          >
            New Deck
          </Button>
          <DeckTable deckList={decks} isReady={isReady} />
        </Stack>
        <Button
          onClick={() => {
            testSM2(
              { repetitions: 0, easeFactor: 1.3, interval: 0, learned: false },
              [4, 4, 4, 4, 4, 4, 4]
            );
            testSM2(
              { repetitions: 0, easeFactor: 1.3, interval: 0, learned: false },
              [5, 5, 5, 5, 5, 5, 5]
            );
          }}
        >
          Test
        </Button>
      </Stack>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
      />
    </>
  );
}

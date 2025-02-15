import NewDeckModal from "@/app/deck/NewDeckModal";
import { useTopLevelDecks } from "@/logic/deck";
import { NavLink, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import DeckTree from "./DeckTree";

export default function DeckList({ minimalMode }: { minimalMode: boolean }) {
  const theme = useMantineTheme();
  const [decks, isReady] = useTopLevelDecks();
  const isXsLayout = useMediaQuery("(min-width: " + theme.breakpoints.sm + ")");
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);

  return (
    isXsLayout &&
    !minimalMode && (
      <>
        <Text c="dimmed" p="xs" pt="md" fz="sm">
          {t("sidebar.decks-title")}
        </Text>
        {isReady &&
          decks?.map((deck) => <DeckTree deck={deck} key={deck.id} />)}
        <NavLink
          label={
            <Text c="dimmed" fz="xs">
              {t("sidebar.decks-add")}
            </Text>
          }
          onClick={() => setNewDeckModalOpened(true)}
          leftSection={<IconPlus size={"1rem"} color={"gray"} />}
        />
        <NewDeckModal
          opened={newDeckModalOpened}
          setOpened={setNewDeckModalOpened}
        />
      </>
    )
  );
}

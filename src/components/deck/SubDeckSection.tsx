import { Button, Group, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Deck, useSubDecks } from "../../logic/deck";
import DeckTable from "./DeckTable";
import NewDeckModal from "./NewDeckModal";

interface SubDeckSectionProps {
  deck?: Deck;
}

function SubDeckSection({ deck }: SubDeckSectionProps) {
  const [subDecks, areSubDecksReady] = useSubDecks(deck);
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const [t] = useTranslation();
  function NewSubDeckButton() {
    return (
      <Button
        disabled={!deck || !areSubDecksReady || !subDecks}
        variant="default"
        leftSection={<IconPlus />}
        onClick={() => {
          if (deck) {
            setNewDeckModalOpened(true);
          }
        }}
      >
        {t("deck.subdeck.add-subdeck-button")}
      </Button>
    );
  }

  return (
    <>
      <Stack gap="sm">
        <Group justify="flex-end">
          <NewSubDeckButton />
        </Group>
        {areSubDecksReady &&
          (subDecks ? (
            <DeckTable deckList={subDecks} isReady={true} />
          ) : (
            <Text c="dimmed">{t("deck.subdeck.load-fail")}</Text>
          ))}
      </Stack>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
        superDeck={deck}
      />
    </>
  );
}

export default SubDeckSection;

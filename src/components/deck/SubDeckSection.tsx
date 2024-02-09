import React, { useState } from "react";
import Section from "../settings/Section";
import { Button, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import DeckTable from "./DeckTable";
import { Deck, useSubDecks } from "../../logic/deck";
import NewDeckModal from "./NewDeckModal";

interface SubDeckSectionProps {
  deck?: Deck;
}

function SubDeckSection({ deck }: SubDeckSectionProps) {
  const [subDecks, areSubDecksReady] = useSubDecks(deck);
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);

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
        New Sub Deck
      </Button>
    );
  }

  return (
    <>
      <Section
        title="Subdecks (to be moved)"
        rightSection={<NewSubDeckButton />}
      >
        {areSubDecksReady &&
          (subDecks ? (
            <DeckTable deckList={subDecks} isReady={true} />
          ) : (
            <Text c="dimmed">Failed to load sub decks.</Text>
          ))}
      </Section>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
        superDeck={deck}
      />
    </>
  );
}

export default SubDeckSection;

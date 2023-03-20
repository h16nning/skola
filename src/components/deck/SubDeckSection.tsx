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
  function AddSubDeckButton() {
    return (
      <Button
        disabled={!deck || failed || !subDecks}
        variant="default"
        leftIcon={<IconPlus />}
        onClick={() => {
          if (deck) {
            setNewDeckModalOpened(true);
          }
        }}
      >
        Add Sub Deck
      </Button>
    );
  }
  const [subDecks, failed] = useSubDecks(deck);
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);

  return (
    <>
      <Section
        title={
          <Group position="apart">
            <>Sub Decks</>
            <AddSubDeckButton />
          </Group>
        }
      >
        {!failed ? (
          <DeckTable deckList={subDecks} />
        ) : (
          <Text c="gray">Failed to load sub decks.</Text>
        )}
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

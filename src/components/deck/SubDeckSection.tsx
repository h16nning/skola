import React, { useState } from "react";
import Section from "../settings/Section";
import { Button, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import DeckTable from "./DeckTable";
import { Deck, useSubDecks } from "../../logic/deck";
import NewDeckModal from "./NewDeckModal";

interface SubDeckSectionProps {
  deck?: Deck;
  reloadDeck: Function;
}

function SubDeckSection({ deck, reloadDeck }: SubDeckSectionProps) {
  const [subDecks, failed] = useSubDecks(deck);
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);

  return (
    <>
      <Section
        title={
          <Group position="apart">
            <span>Sub Decks</span>
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
              New Sub Deck
            </Button>
          </Group>
        }
      >
        {!failed ? (
          <DeckTable deckList={subDecks} />
        ) : (
          <Text c="gray">Failed to load decks</Text>
        )}
      </Section>
      <NewDeckModal
        opened={newDeckModalOpened}
        setOpened={setNewDeckModalOpened}
        superDeck={deck}
        reloadDeck={reloadDeck}
      />
    </>
  );
}

export default SubDeckSection;

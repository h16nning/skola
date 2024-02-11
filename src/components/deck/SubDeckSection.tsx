import React, { useState } from "react";
import Section from "../settings/Section";
import { Button, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import DeckTable from "./DeckTable";
import { Deck, useSubDecks } from "../../logic/deck";
import NewDeckModal from "./NewDeckModal";
import { useTranslation } from "react-i18next";

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
        {t("deck.subdeck.new")}
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
            <Text c="dimmed">{t("deck.subdeck.load-fail")}</Text>
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

import React from "react";
import Section from "../settings/Section";
import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import DeckTable from "./DeckTable";
import { Deck } from "../../logic/deck";

interface SubdeckSectionProps {
  deck?: Deck;
}

function SubdeckSection({ deck }: SubdeckSectionProps) {
  return (
    <Section
      title={
        <Group position="apart">
          <span>Subdecks</span>
          <Button variant="default" leftIcon={<IconPlus />}>
            New Subdeck
          </Button>
        </Group>
      }
    >
      <DeckTable deckList={[]} />
    </Section>
  );
}

export default SubdeckSection;

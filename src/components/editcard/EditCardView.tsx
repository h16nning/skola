import React, { useMemo } from "react";
import { Card, CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { Group, Stack, Text } from "@mantine/core";
import CardMenu from "./CardMenu";
import { getUtils } from "../CardTypeManager";

interface EditCardsProps {
  card?: Card<CardType>;
}
function EditCardView({ card }: EditCardsProps) {
  if (card === undefined) {
    return <NoCardView />;
  }
  return <CardView card={card} />;
}
function NoCardView() {
  return (
    <Text fz="sm" color="dimmed">
      No card
    </Text>
  );
}

function CardView({ card }: { card: Card<CardType> }) {
  const deck = useDeckOf(card);

  const CardEditor = useMemo(() => {
    return deck ? getUtils(card.content.type).editor(card, deck, "edit") : null;
  }, [card, deck]);

  return (
    <Stack>
      <Group position="apart">
        <Text fz="xs">Edit Card</Text>
        <CardMenu card={card} />
        {CardEditor}
      </Group>
    </Stack>
  );
}
export default EditCardView;

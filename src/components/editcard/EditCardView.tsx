import React, { useMemo } from "react";
import { Card, CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { Group, Stack, Text } from "@mantine/core";
import CardMenu from "./CardMenu";
import { getUtils } from "../../logic/CardTypeManager";

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
      No card selected
    </Text>
  );
}

function CardView({ card }: { card: Card<CardType> }) {
  const [deck] = useDeckOf(card);

  const CardEditor = useMemo(() => {
    return deck ? getUtils(card).editor(card, deck, "edit") : null;
  }, [card, deck]);

  return (
    <Stack style={{ height: "100%", overflowY: "scroll" }}>
      <Group justify="space-between" wrap="nowrap">
        <Text fz="xs" fw={600}>
          Edit Card
        </Text>
        <CardMenu card={card} />
      </Group>
      {CardEditor}
    </Stack>
  );
}
export default EditCardView;

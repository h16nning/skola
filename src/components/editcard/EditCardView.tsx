import React, { useMemo } from "react";
import { Card, CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { Group, Stack, Text } from "@mantine/core";
import CardMenu from "./CardMenu";
import { getUtils } from "../../logic/CardTypeManager";
import { useLoaderData } from "react-router-dom";

function EditCardView() {
  const card = useLoaderData() as Card<CardType> | undefined;
  if (!card) {
    return <NoCardView />;
  }
  return <CardView card={card} />;
}

export function NoCardView() {
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
        <Group>
          <Text fz="xs" fw={600}>
            Edit Card{" "}
            <Text c="dimmed" span fz="xs" fw={600}>
              ({card.content.type})
            </Text>
          </Text>
        </Group>
        <CardMenu card={card} withEdit={false} />
      </Group>
      {CardEditor}
    </Stack>
  );
}
export default EditCardView;

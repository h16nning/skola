import React from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import CardTextEditor, { useCardEditor } from "./CardTextEditor";
import {
  IconCheck,
  IconCross,
  IconDeviceFloppy,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { NormalCardUtils } from "../../logic/CardTypeManager";
import { Card, CardType, newCard, updateCard } from "../../logic/card";
import { Deck } from "../../logic/deck";
import { notifications } from "@mantine/notifications";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../Notification";

interface NormalCardEditorProps {
  deck: Deck;
  card?: Card<CardType.Normal>;
}

function NormalCardEditor({ deck, card }: NormalCardEditorProps) {
  const frontEditor = useCardEditor(card?.content.front);
  const backEditor = useCardEditor(card?.content.back);

  return (
    <Stack>
      <Stack spacing={0}>
        <Text fz="sm" fw={700}>
          Front Side
        </Text>
        <CardTextEditor editor={frontEditor} />
      </Stack>
      <Stack spacing={0}>
        <Text fz="sm" fw={700}>
          Back Side
        </Text>
        <CardTextEditor editor={backEditor} />
      </Stack>
      <Group position="right">
        {!card ? (
          <Button
            leftIcon={<IconPlus />}
            onClick={async () => {
              try {
                await newCard(
                  NormalCardUtils.create({
                    front: frontEditor?.getHTML() ?? "",
                    back: backEditor?.getHTML() ?? "",
                  }),
                  deck
                );
                successfullyAdded();
              } catch (error) {
                addFailed();
              }
            }}
          >
            Add Card
          </Button>
        ) : (
          <Button
            leftIcon={<IconDeviceFloppy />}
            onClick={async () => {
              try {
                const t = await updateCard(card.id, {
                  "content.front": frontEditor?.getHTML() ?? "",
                  "content.back": backEditor?.getHTML() ?? "",
                });
                if (t === 0) {
                  throw new Error("failed");
                }
                successfullySaved();
              } catch (error) {
                saveFailed();
              }
            }}
          >
            Save
          </Button>
        )}
      </Group>
    </Stack>
  );
}

export default NormalCardEditor;

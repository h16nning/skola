import React from "react";
import { Anchor, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Deck } from "../../logic/deck";
import { Card, CardType, useStatesOf } from "../../logic/card";
import { State } from "fsrs.js";

interface DebugDeckModalProps {
  opened: boolean;
  setOpened: Function;
  deck?: Deck;
  cards: Card<CardType>[];
}

function DebugDeckModal({
  opened,
  setOpened,
  deck,
  cards,
}: DebugDeckModalProps) {
  const states = useStatesOf(cards);
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      title="Debug"
    >
      <Stack justify="space-between">
        {deck ? (
          <Stack gap="xs">
            <Text fz="xs">
              <b>Name: </b>"{deck.name}"
            </Text>
            <Text fz="xs">
              <b>ID: </b>"{deck.id}"
            </Text>
            <Text fz="xs">
              <b>SubDecks: </b>
              {deck.subDecks.map((subDeckId) => (
                <span key={subDeckId}>
                  <Anchor href={"/deck/" + subDeckId}>{subDeckId}</Anchor>,{" "}
                </span>
              ))}
            </Text>
            <Text fz="xs">
              <b>SuperDecks: </b>"{deck.superDecks}"
            </Text>
            <Text fz="xs">
              <b>Cards: </b>"
              {deck.cards.map((s) => (
                <span key={s}>{s + ", "}</span>
              ))}
              "
            </Text>

            <Text fz="xs">
              <b>Direct Card Length: </b>
              {deck.cards.length}
            </Text>
            <Text fz="xs">
              <b>Contained Card Length: </b>
              {cards.length}
            </Text>
            <Text fz="xs">
              <b>New: </b>
              {states[State.New]}
            </Text>
            <Text fz="xs">
              <b>Learning: </b>
              {states[State.Learning]}
            </Text>
            <Text fz="xs">
              <b>Review: </b>
              {states[State.Review]}
            </Text>
            <Text fz="xs">
              <b>Relearning: </b>
              {states[State.Relearning]}
            </Text>
          </Stack>
        ) : (
          <Text fz="xs">No deck</Text>
        )}
        <Group justify="flex-end">
          <Button onClick={() => setOpened(false)}>Close</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DebugDeckModal;

import React from "react";
import { Anchor, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Deck } from "../../logic/deck";
import { Card, CardsStats, CardType } from "../../logic/card";

interface DebugDeckModalProps {
  opened: boolean;
  setOpened: Function;
  deck?: Deck;
  cards: Card<CardType>[];
  stats: CardsStats;
}

function DebugDeckModal({
  opened,
  setOpened,
  deck,
  cards,
  stats,
}: DebugDeckModalProps) {
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
              <b>New Cards: </b>
              {stats.newCards}
            </Text>
            <Text fz="xs">
              <b>Learning Cards: </b>
              {stats.learningCards}
            </Text>
            <Text fz="xs">
              <b>Due Cards: </b>
              {stats.dueCards}
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

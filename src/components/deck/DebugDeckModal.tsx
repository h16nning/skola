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
          <Stack fz="xs" spacing="xs">
            <Text>
              <b>Name: </b>"{deck.name}"
            </Text>
            <Text>
              <b>ID: </b>"{deck.id}"
            </Text>
            <Text>
              <b>SubDecks: </b>
              {deck.subDecks.map((subDeckId, i) => (
                <>
                  <Anchor key={i} href={"/deck/" + subDeckId}>
                    {subDeckId}
                  </Anchor>
                  <span>, </span>
                </>
              ))}
            </Text>
            <Text>
              <b>SuperDecks: </b>"{deck.superDecks}"
            </Text>
            <Text>
              <b>Cards: </b>"{deck.cards.map((s) => s + ", ")}"
            </Text>

            <Text>
              <b>Direct Card Length: </b>
              {deck.cards.length}
            </Text>
            <Text>
              <b>Contained Card Length: </b>
              {cards.length}
            </Text>
            <Text>
              <b>New Cards: </b>
              {stats.newCards}
            </Text>
            <Text>
              <b>Learning Cards: </b>
              {stats.learningCards}
            </Text>
            <Text>
              <b>Due Cards: </b>
              {stats.dueCards}
            </Text>
            <Text>
              <b>Learned Cards: </b>
              {stats.learnedCards}
            </Text>
          </Stack>
        ) : (
          <Text>No deck</Text>
        )}
        <Group position="right">
          <Button onClick={() => setOpened(false)}>Close</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DebugDeckModal;

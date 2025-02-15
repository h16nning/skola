import { useStatesOf } from "@/logic/card/hooks/useStatesOf";
import { NoteType } from "@/logic/note/note";
import { Anchor, Modal, Stack, Text } from "@mantine/core";
import { State } from "fsrs.js";
import { Card } from "../../logic/card/card";
import { Deck } from "../../logic/deck/deck";

interface DebugDeckModalProps {
  opened: boolean;
  setOpened: Function;
  deck?: Deck;
  cards: Card<NoteType>[];
}

function DebugDeckModal({
  opened,
  setOpened,
  deck,
  cards,
}: DebugDeckModalProps) {
  const states = useStatesOf(cards);
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Debug">
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
      </Stack>
    </Modal>
  );
}

export default DebugDeckModal;

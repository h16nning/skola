import React from "react";
import { Deck } from "../../logic/deck";
import ModalProps from "../custom/ModalProps";
import { Modal } from "@mantine/core";

interface DeckOptionsModalProps extends ModalProps {
  deck: Deck;
}

function DeckOptionsModal({ opened, setOpened }: DeckOptionsModalProps) {
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Options">
      Here is where deck options will reside.
    </Modal>
  );
}

export default DeckOptionsModal;

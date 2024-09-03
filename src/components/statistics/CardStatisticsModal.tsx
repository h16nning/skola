import { Modal } from "@mantine/core";
import { Card, NoteType } from "../../logic/card";
import ModalProps from "../custom/ModalProps";
import CardHistory from "./CardHistory";

interface DeckOptionsModalProps extends ModalProps {
  card?: Card<NoteType>;
}

function DeckOptionsModal({ opened, setOpened, card }: DeckOptionsModalProps) {
  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Statistics">
      <CardHistory card={card} />
    </Modal>
  );
}

export default DeckOptionsModal;

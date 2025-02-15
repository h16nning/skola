import { NoteType } from "@/logic/note/note";
import { Modal } from "@mantine/core";
import ModalProps from "../../components/ModalProps";
import { Card } from "../../logic/card/card";
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

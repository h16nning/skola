import ModalProps from "@/components/ModalProps";
import { Modal } from "@/components/ui";
import { Card } from "@/logic/card/card";
import { NoteType } from "@/logic/note/note";
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

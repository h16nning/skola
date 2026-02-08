import { Modal } from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";
import { Card } from "@/logic/card/card";
import { NoteType } from "@/logic/note/note";
import DebugCardTable from "./DebugCardTable";

interface DebugCardModalProps {
  opened: boolean;
  setOpened: (value: boolean) => void;
  card?: Card<NoteType>;
}

function DebugCardModal({ opened, setOpened, card }: DebugCardModalProps) {
  try {
    return (
      <Modal opened={opened} onClose={() => setOpened(false)} title="Debug">
        <DebugCardTable card={card} />
      </Modal>
    );
  } catch (e) {
    console.error(e);
    return (
      <Text size="sm" weight="bold" style={{ color: "var(--theme-red-600)" }}>
        Faulty card
      </Text>
    );
  }
}

export default DebugCardModal;

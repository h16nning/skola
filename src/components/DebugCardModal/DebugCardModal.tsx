import { Modal, Text } from "@mantine/core";
import { Card, CardType } from "../../logic/card";
import DebugCardTable from "./DebugCardTable";

interface DebugCardModalProps {
  opened: boolean;
  setOpened: Function;
  card?: Card<CardType>;
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
      <Text c="red" fw="700" fz="sm">
        Faulty cart
      </Text>
    );
  }
}

export default DebugCardModal;

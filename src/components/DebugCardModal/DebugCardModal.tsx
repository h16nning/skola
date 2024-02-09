import classes from "./DebugCardModal.module.css";
import React, { Fragment } from "react";
import {
  Anchor,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Space,
} from "@mantine/core";
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
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        title="Debug"
      >
        <Stack justify="space-between">
          <DebugCardTable card={card} />
          <Group justify="right">
            <Button onClick={() => setOpened(false)}>Close</Button>
          </Group>
        </Stack>
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

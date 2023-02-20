import React, { ReactNode } from "react";
import ModalProps from "./custom/ModalProps";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";

interface DangerousConfirmModalProps extends ModalProps {
  dangerousAction: Function;
  dangerousDependencies: Array<any>;
  dangerousTitle: string;
  dangerousDescription: ReactNode;
}

function DangerousConfirmModal({
  dangerousDependencies,
  dangerousAction,
  dangerousTitle,
  dangerousDescription,
  opened,
  setOpened,
}: DangerousConfirmModalProps) {
  return (
    <Modal
      title={dangerousTitle}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Stack>
        <Text fz="sm">{dangerousDescription}</Text>
        <Group position="right" spacing="xs">
          <Button variant="default">Cancel</Button>
          <Button
            color="red"
            onClick={() => dangerousAction(...dangerousDependencies)}
          >
            {dangerousTitle}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DangerousConfirmModal;

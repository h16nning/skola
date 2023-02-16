import React, { ReactNode } from "react";
import { Modal, Stack } from "@mantine/core";

interface NewCategoryModalProps {
  opened: boolean;
  setOpened: Function;
  children: ReactNode;
}

function NewCategoryModal({
  opened,
  setOpened,
  children,
}: NewCategoryModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      title="Create New Category"
    >
      <Stack justify="space-between"></Stack>
    </Modal>
  );
}

export default NewCategoryModal;

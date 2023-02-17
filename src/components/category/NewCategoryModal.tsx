import React from "react";
import { Button, Group, Input, Modal, Stack } from "@mantine/core";

interface NewCategoryModalProps {
  opened: boolean;
  setOpened: Function;
}

function NewCategoryModal({ opened, setOpened }: NewCategoryModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      title="Create New Category"
    >
      <Stack justify="space-between">
        <Input.Wrapper label="Category Name">
          <Input />
        </Input.Wrapper>
        <Group position="right">
          <Button
            variant="default"
            onClick={() => {
              setOpened(false);
            }}
          >
            Cancel
          </Button>
          <Button>Add</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default NewCategoryModal;

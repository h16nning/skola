import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import ModalProps from "../custom/ModalProps";
import { Deck, newDeck } from "../../logic/deck";

interface NewDeckModalProps extends ModalProps {
  superDeck?: Deck;
  reloadDeck?: Function;
}

function NewDeckModal({
  opened,
  setOpened,
  superDeck,
  reloadDeck,
}: NewDeckModalProps) {
  const [nameValue, setNameValue] = useState<string>("");
  const [addingDeck, setAddingDeck] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("initial");
  async function tryAddDeck() {
    setAddingDeck(true);
    try {
      const id = await newDeck(nameValue, superDeck);
      setStatus("Deck sucessfully added. Id: " + id);
      setNameValue("");
      setOpened(false);
      reloadDeck?.();
    } catch (error) {
      setStatus("Failed to add deck: " + error);
    }
    setAddingDeck(false);
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      title={"Create New Deck" + (superDeck ? " in " + superDeck?.name : "")}
    >
      <Stack justify="space-between">
        <TextInput
          label="Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
        />
        <Text>{status}</Text>
        <Group position="right">
          <Button
            variant="default"
            onClick={() => {
              setOpened(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!isInputValid()}
            loading={addingDeck}
            onClick={() => {
              void tryAddDeck();
            }}
          >
            Add
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  function isInputValid(): boolean {
    return nameValue !== "";
  }
}

export default NewDeckModal;

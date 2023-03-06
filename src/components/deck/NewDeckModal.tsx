import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import ModalProps from "../custom/ModalProps";
import { Deck, newDeck } from "../../logic/deck";

interface NewDeckModalProps extends ModalProps {
  superDeck?: Deck;
}

function NewDeckModal({ opened, setOpened, superDeck }: NewDeckModalProps) {
  const [nameValue, setNameValue] = useState<string>("");
  const [addingDeck, setAddingDeck] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);
  async function tryAddDeck() {
    setAddingDeck(true);
    try {
      const id = await newDeck(nameValue, superDeck);
      setNameValue("");
      setOpened(false);
    } catch (error) {
      setStatus("Failed to add deck: " + error);
    }
    setAddingDeck(false);
    setNameValue("");
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
          data-autofocus
          label="Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
        />
        {status ? <Text>{status}</Text> : <></>}
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

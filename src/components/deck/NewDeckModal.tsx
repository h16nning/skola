import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import ModalProps from "../custom/ModalProps";
import { Deck, newDeck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";

interface NewDeckModalProps extends ModalProps {
  superDeck?: Deck;
}

function NewDeckModal({ opened, setOpened, superDeck }: NewDeckModalProps) {
  const navigate = useNavigate();

  const [nameValue, setNameValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [addingDeck, setAddingDeck] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);

  async function tryAddDeck() {
    setAddingDeck(true);
    try {
      const id = await newDeck(nameValue, superDeck, descriptionValue);
      setNameValue("");
      setOpened(false);
      navigate("/deck/" + id);
    } catch (error) {
      setStatus("Failed to add deck: " + error);
    }
    setAddingDeck(false);
    setNameValue("");
    setDescriptionValue("");
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
          placeholder="for example 'Spanish', 'Anatomy' or 'History'"
          data-autofocus
          label="Name"
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
        />
        <TextInput
          placeholder="Optional"
          data-autofocus
          label="Description"
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.currentTarget.value)}
        />
        {status ? <Text>{status}</Text> : <></>}
        <Group justify="flex-end">
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

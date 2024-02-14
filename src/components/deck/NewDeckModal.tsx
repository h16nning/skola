import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import ModalProps from "../custom/ModalProps";
import { Deck, newDeck } from "../../logic/deck";
import { useNavigate } from "react-router-dom";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";

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
    if (!isInputValid()) return;
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

  useHotkeys([["mod+Enter", () => tryAddDeck()]]);

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
          onKeyDown={getHotkeyHandler([["mod+Enter", () => tryAddDeck()]])}
        />
        <TextInput
          placeholder="Optional"
          data-autofocus
          label="Description"
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([["mod+Enter", () => tryAddDeck()]])}
        />
        {status ? <Text>{status}</Text> : <></>}
        <Group justify="flex-end" gap="sm">
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
    return nameValue.trim() !== "";
  }
}

export default NewDeckModal;

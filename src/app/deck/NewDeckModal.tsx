import { newDeck } from "@/logic/deck/newDeck";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { t } from "i18next";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalProps from "../../components/ModalProps";
import { Deck } from "../../logic/deck/deck";

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
      title={
        superDeck
          ? t("deck.new-deck-modal.new-subdeck", { superDeck: superDeck.name })
          : t("deck.new-deck-modal.new-deck")
      }
    >
      <Stack justify="space-between">
        <TextInput
          placeholder={t("deck.new-deck-modal.name-placeholder")}
          data-autofocus
          label={t("deck.new-deck-modal.name")}
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([["mod+Enter", () => tryAddDeck()]])}
        />
        <TextInput
          placeholder={t("deck.new-deck-modal.description-placeholder")}
          data-autofocus
          label={t("deck.new-deck-modal.description")}
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
            {t("global.cancel")}
          </Button>
          <Button
            disabled={!isInputValid()}
            loading={addingDeck}
            onClick={() => {
              void tryAddDeck();
            }}
          >
            {t("deck.new-deck-modal.submit")}
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

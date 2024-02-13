import React, { useCallback, useEffect, useState } from "react";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { Deck, renameDeck } from "../../logic/deck";
import { generalFail } from "../custom/Notification/Notification";
import { t } from "i18next";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";

interface RenameModalProps {
  deck: Deck;
  opened: boolean;
  setOpened: Function;
}

function RenameCardModal({ deck, opened, setOpened }: RenameModalProps) {
  const [nameValue, setNameValue] = useState<string>(deck.name);

  useEffect(() => setNameValue(deck.name), [deck]);

  const tryRenameDeck = useCallback(() => {
    if (nameValue !== "") {
      renameDeck(deck.id, nameValue)
        .then(() => {
          setOpened(false);
        })
        .catch(() => generalFail());
    }
  }, [deck, nameValue, setOpened]);

  useHotkeys([["mod+Enter", () => tryRenameDeck()]]);

  return (
    <Modal
      title={t("rename-deck.title", { deckName: deck.name })}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Stack>
        <TextInput
          data-autofocus
          label={t("rename-deck.new-name")}
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([["mod+Enter", () => tryRenameDeck()]])}
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={() => setOpened(false)}>
            {t("global.cancel")}
          </Button>
          <Button disabled={nameValue === ""} onClick={tryRenameDeck}>
            {t("rename-deck.rename-button")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default RenameCardModal;

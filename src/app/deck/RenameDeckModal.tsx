import { genericFail } from "@/components/Notification/Notification";
import { renameDeck } from "@/logic/deck/renameDeck";
import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { Deck } from "../../logic/deck/deck";

interface RenameDeckModalProps {
  deck: Deck;
  opened: boolean;
  setOpened: Function;
}

function RenameDeckModal({ deck, opened, setOpened }: RenameDeckModalProps) {
  const [nameValue, setNameValue] = useState<string>(deck.name);

  useEffect(() => setNameValue(deck.name), [deck]);

  const tryRenameDeck = useCallback(() => {
    if (nameValue !== "") {
      renameDeck(deck.id, nameValue)
        .then(() => {
          setOpened(false);
        })
        .catch(() => genericFail());
    }
  }, [deck, nameValue, setOpened]);

  useHotkeys([["mod+Enter", () => tryRenameDeck()]]);

  return (
    <Modal
      title={t("deck.rename.title", { deckName: deck.name })}
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <Stack>
        <TextInput
          data-autofocus
          label={t("deck.rename.new-name")}
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([["mod+Enter", () => tryRenameDeck()]])}
        />
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={() => setOpened(false)}>
            {t("global.cancel")}
          </Button>
          <Button disabled={nameValue === ""} onClick={tryRenameDeck}>
            {t("deck.rename.rename-button")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default RenameDeckModal;

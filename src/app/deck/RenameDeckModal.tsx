import { genericFail } from "@/components/Notification/Notification";
import { Button, Modal, TextInput } from "@/components/ui";
import { getHotkeyHandler } from "@/lib/hooks/getHotkeyHandler";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { Deck } from "@/logic/deck/deck";
import { renameDeck } from "@/logic/deck/renameDeck";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import "./RenameDeckModal.css";

const BASE = "rename-deck-modal";

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
      <div className={`${BASE}__content`}>
        <TextInput
          data-autofocus
          label={t("deck.rename.new-name")}
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([["mod+Enter", () => tryRenameDeck()]])}
        />
        <div className={`${BASE}__actions`}>
          <Button variant="default" onClick={() => setOpened(false)}>
            {t("global.cancel")}
          </Button>
          <Button
            disabled={nameValue === ""}
            onClick={tryRenameDeck}
            variant="primary"
          >
            {t("deck.rename.rename-button")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default RenameDeckModal;

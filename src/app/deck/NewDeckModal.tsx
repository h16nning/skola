import type ModalProps from "@/components/ModalProps";
import { Button, Modal, TextInput } from "@/components/ui";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import type { Deck } from "@/logic/deck/deck";
import { newDeck } from "@/logic/deck/newDeck";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewDeckModal.css";
import { ColorIdentifier } from "@/lib/ColorIdentifier";
import DeckColorChooser from "./DeckColorChooser";

const BASE = "new-deck-modal";

interface NewDeckModalProps extends ModalProps {
  superDeck?: Deck;
}

function NewDeckModal({ opened, setOpened, superDeck }: NewDeckModalProps) {
  const navigate = useNavigate();

  const [nameValue, setNameValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [deckColor, setDeckColor] = useState<ColorIdentifier>("sky");
  const [addingDeck, setAddingDeck] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);

  function isInputValid(): boolean {
    return nameValue.trim() !== "";
  }

  function handleClose() {
    setOpened(false);
  }

  async function tryAddDeck() {
    if (!isInputValid()) return;
    setAddingDeck(true);
    try {
      const id = await newDeck(
        nameValue,
        superDeck,
        descriptionValue,
        deckColor
      );
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void tryAddDeck();
    }
  }

  useHotkeys([["mod+Enter", () => tryAddDeck()]]);

  const title = superDeck
    ? t("deck.new-deck-modal.new-subdeck", { superDeck: superDeck.name })
    : t("deck.new-deck-modal.new-deck");

  return (
    <Modal opened={opened} onClose={handleClose} title={title}>
      <div className={`${BASE}__form`}>
        <TextInput
          placeholder={t("deck.new-deck-modal.name-placeholder")}
          autoFocus
          label={t("deck.new-deck-modal.name")}
          value={nameValue}
          onChange={(e) => setNameValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <TextInput
          placeholder={t("deck.new-deck-modal.description-placeholder")}
          label={t("deck.new-deck-modal.description")}
          value={descriptionValue}
          onChange={(e) => setDescriptionValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <DeckColorChooser deckColor={deckColor} setDeckColor={setDeckColor} />
        {status && <p className={`${BASE}__status`}>{status}</p>}
        <div className={`${BASE}__actions`}>
          <Button variant="default" onClick={handleClose}>
            {t("global.cancel")}
          </Button>
          <Button
            disabled={!isInputValid() || addingDeck}
            variant="primary"
            onClick={() => void tryAddDeck()}
          >
            {addingDeck ? "..." : t("deck.new-deck-modal.submit")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default NewDeckModal;

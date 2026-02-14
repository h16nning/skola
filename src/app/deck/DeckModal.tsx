import type ModalProps from "@/components/ModalProps";
import { Button, Modal, TextInput } from "@/components/ui";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import type { Deck } from "@/logic/deck/deck";
import { newDeck } from "@/logic/deck/newDeck";
import { updateDeck } from "@/logic/deck/updateDeck";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeckModal.css";
import { ColorIdentifier } from "@/lib/ColorIdentifier";
import DeckColorChooser from "./DeckColorChooser";

const BASE = "deck-modal";

interface DeckModalProps extends ModalProps {
  mode: "create" | "edit";
  deck?: Deck;
  superDeck?: Deck;
}

function DeckModal({
  opened,
  setOpened,
  mode,
  deck,
  superDeck,
}: DeckModalProps) {
  const navigate = useNavigate();

  const [nameValue, setNameValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  const [deckColor, setDeckColor] = useState<ColorIdentifier>("sky");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && deck) {
      setNameValue(deck.name);
      setDescriptionValue(deck.description || "");
      setDeckColor(deck.color || "sky");
    } else {
      setNameValue("");
      setDescriptionValue("");
      setDeckColor("sky");
    }
  }, [mode, deck, opened]);

  function isInputValid(): boolean {
    return nameValue.trim() !== "";
  }

  function handleClose() {
    setOpened(false);
    setStatus(null);
  }

  async function handleSubmit() {
    if (!isInputValid()) return;
    setIsSubmitting(true);
    setStatus(null);

    try {
      if (mode === "create") {
        const id = await newDeck(
          nameValue,
          superDeck,
          descriptionValue,
          deckColor
        );
        setOpened(false);
        navigate("/deck/" + id);
      } else if (mode === "edit" && deck) {
        await updateDeck(deck.id, nameValue, descriptionValue, deckColor);
        setOpened(false);
      }
    } catch (error) {
      setStatus(
        `Failed to ${mode === "create" ? "add" : "update"} deck: ${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void handleSubmit();
    }
  }

  useHotkeys([["mod+Enter", () => handleSubmit()]]);

  const title =
    mode === "create"
      ? superDeck
        ? t("deck.new-deck-modal.new-subdeck", { superDeck: superDeck.name })
        : t("deck.new-deck-modal.new-deck")
      : t("deck.edit.title", { deckName: deck?.name || "" });

  const submitButtonText =
    mode === "create" ? t("deck.new-deck-modal.submit") : t("deck.edit.submit");

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
            disabled={!isInputValid() || isSubmitting}
            variant="primary"
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? "..." : submitButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeckModal;

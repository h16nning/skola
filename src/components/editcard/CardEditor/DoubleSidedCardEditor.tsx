import classes from "./DoubleSidedCardEditor.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { Stack, Text } from "@mantine/core";
import CardEditor, { useCardEditor } from "./CardEditor";
import { EditMode } from "../../../logic/CardTypeManager";
import { Card, CardType, newCards } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import CardEditorFooter from "../CardEditorFooter";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import { useHotkeys } from "@mantine/hooks";
import { Editor } from "@tiptap/react";
import {
  DoubleSidedCardUtils,
  createDoubleSidedCardPair,
} from "../../../logic/CardTypeImplementations/DoubleSidedCard";
import { useSharedValue } from "../../../logic/sharedvalue";
import { useTranslation } from "react-i18next";

interface DoubleSidedCardEditorProps {
  card: Card<CardType.DoubleSided> | null;
  deck: Deck;
  mode: EditMode;
}

async function finish(
  mode: EditMode,
  clear: () => void,
  deck: Deck,
  card: Card<CardType.DoubleSided> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  if (mode === "edit") {
    //SAVE
    try {
      if (card) {
        DoubleSidedCardUtils.update(
          {
            front: frontEditor?.getHTML() ?? "",
            back: backEditor?.getHTML() ?? "",
          },
          card
        );
      }
      successfullySaved();
    } catch {
      saveFailed();
    }
  } else {
    //NEW
    try {
      createDoubleSidedCardPair({
        value1: frontEditor?.getHTML() ?? "",
        value2: backEditor?.getHTML() ?? "",
      }).then((cards) => newCards(cards, deck));
      clear && clear();
      successfullyAdded();
    } catch {
      addFailed();
    }
  }
}

function DoubleSidedCardEditor({
  card,
  deck,
  mode,
}: DoubleSidedCardEditorProps) {
  const [t] = useTranslation();
  const [requestedFinish, setRequestedFinish] = useState(false);

  useHotkeys([["mod+Enter", () => setRequestedFinish(true)]]);

  const editor1 = useCardEditor({
    content: useSharedValue(card?.content.frontReferenceId ?? "")?.value ?? "",
    finish: () => setRequestedFinish(true),
  });

  const editor2 = useCardEditor({
    content: useSharedValue(card?.content.backReferenceId ?? "")?.value ?? "",
    finish: () => setRequestedFinish(true),
  });

  const clear = useCallback(() => {
    editor1?.commands.setContent("");
    editor2?.commands.setContent("");
    editor1?.commands.focus();
  }, [editor1, editor2]);

  useEffect(() => {
    if (requestedFinish) {
      finish(mode, clear, deck, card, editor1, editor2);
      setRequestedFinish(false);
    }
  }, [requestedFinish, mode, clear, deck, card, editor1, editor2]);

  return (
    <Stack gap="2rem">
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          {t("cards.editor.double_sided.front")}
        </Text>
        <CardEditor editor={editor1} key="front" className={classes} />
      </Stack>
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          {t("cards.editor.double_sided.back")}
        </Text>
        <CardEditor editor={editor2} key="back" />
      </Stack>
      <CardEditorFooter
        finish={() => finish(mode, clear, deck, card, editor1, editor2)}
        mode={mode}
      />
    </Stack>
  );
}

export default DoubleSidedCardEditor;

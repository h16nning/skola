import classes from "./DoubleSidedCardEditor.module.css";
import React, { useCallback } from "react";
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

interface DoubleSidedCardEditorProps {
  card: Card<CardType.DoubleSided> | null;
  deck: Deck;
  mode: EditMode;
}

async function finish(
  mode: EditMode,
  clear: Function,
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
  useHotkeys([
    ["mod+Enter", () => finish(mode, clear, deck, card, editor1, editor2)],
  ]);

  const editor1 = useCardEditor({
    content: useSharedValue(card?.content.frontReferenceId ?? "")?.value ?? "",
  });

  const editor2 = useCardEditor({
    content: useSharedValue(card?.content.backReferenceId ?? "")?.value ?? "",
  });

  const clear = useCallback(() => {
    editor1?.commands.setContent("");
    editor2?.commands.setContent("");
    editor1?.commands.focus();
  }, [editor1, editor2]);

  return (
    <Stack gap="2rem">
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          Field 1
        </Text>
        <CardEditor editor={editor1} key="front" className={classes} />
      </Stack>
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          Field 2
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

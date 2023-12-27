import React, { useCallback } from "react";
import { Stack, Text, useMantineTheme } from "@mantine/core";
import CardTextEditor, { useCardEditor } from "./CardTextEditor";
import { EditMode } from "../../logic/CardTypeManager";
import {
  Card,
  CardType,
  newCard,
  newCards,
  updateCard,
} from "../../logic/card";
import { Deck } from "../../logic/deck";
import CardEditorFooter from "./CardEditorFooter";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../custom/Notification";
import { useHotkeys } from "@mantine/hooks";
import { Editor } from "@tiptap/react";
import {
  DoubleSidedCardUtils,
  createDoubleSidedCardPair,
} from "../../logic/CardTypeImplementations/DoubleSidedCard";
import { useSharedValue } from "../../logic/sharedvalue";

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
    } catch (error) {
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
    } catch (error) {
      addFailed();
    }
  }
}

function DoubleSidedCardEditor({
  card,
  deck,
  mode,
}: DoubleSidedCardEditorProps) {
  const theme = useMantineTheme();

  useHotkeys([
    ["mod+Enter", () => finish(mode, clear, deck, card, editor1, editor2)],
  ]);

  const editor1 = useCardEditor(useSharedValue(card?.content.frontReferenceId ?? "")?.value ?? "");

  const editor2 = useCardEditor(useSharedValue(card?.content.backReferenceId ?? "")?.value ?? "");

  const clear = useCallback(() => {
    editor1?.commands.setContent("");
    editor2?.commands.setContent("");
    editor1?.commands.focus();
  }, [editor1, editor2]);

  return (
    <Stack spacing="2rem">
      <Stack spacing={0}>
        <Text fz="sm" fw={600}>
          Field 1
        </Text>
        <CardTextEditor
          editor={editor1}
          key="front"
          styles={{
            content: {
              "& p": {
                fontFamily: theme.headings.fontFamily,
                fontWeight: 600,
                fontSize: theme.headings.sizes.h3.fontSize,
              },
            },
          }}
        />
      </Stack>
      <Stack spacing={0}>
        <Text fz="sm" fw={600}>
          Field 2
        </Text>
        <CardTextEditor editor={editor2} key="back" />
      </Stack>
      <CardEditorFooter
        finish={() => finish(mode, clear, deck, card, editor1, editor2)}
        mode={mode}
      />
    </Stack>
  );
}

export default DoubleSidedCardEditor;

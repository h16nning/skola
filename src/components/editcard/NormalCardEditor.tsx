import React, { useCallback } from "react";
import { Stack, Text, useMantineTheme } from "@mantine/core";
import CardTextEditor, { useCardEditor } from "./CardTextEditor";
import { EditMode, NormalCardUtils } from "../CardTypeManager";
import { Card, CardType, newCard, updateCard } from "../../logic/card";
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

interface NormalCardEditorProps {
  card: Card<CardType.Normal> | null;
  deck: Deck;
  mode: EditMode;
}

async function finish(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  card: Card<CardType.Normal> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  const cardInstance = createCardInstance(card, frontEditor, backEditor);
  if (cardInstance !== null) {
    if (mode === "edit") {
      //SAVE
      try {
        console.log(cardInstance.id);
        const numberOfUpdatedRecords = await updateCard(
          cardInstance.id,
          cardInstance
        );
        if (numberOfUpdatedRecords === 0) {
          saveFailed();
          return;
        }
        successfullySaved();
      } catch (error) {
        saveFailed();
      }
    } else {
      //NEW
      try {
        await newCard(cardInstance, deck);
        clear && clear();
        successfullyAdded();
      } catch (error) {
        addFailed();
      }
    }
  }
}

function createCardInstance(
  card: Card<CardType.Normal> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  return card
    ? NormalCardUtils.update(
        {
          front: frontEditor?.getHTML() ?? "",
          back: backEditor?.getHTML() ?? "",
        },
        card
      )
    : NormalCardUtils.create({
        front: frontEditor?.getHTML() ?? "",
        back: backEditor?.getHTML() ?? "",
      });
}
function NormalCardEditor({ card, deck, mode }: NormalCardEditorProps) {
  const theme = useMantineTheme();

  useHotkeys([
    [
      "mod+Enter",
      () => finish(mode, clear, deck, card, frontEditor, backEditor),
    ],
  ]);

  const frontEditor = useCardEditor(card?.content.front ?? "");

  const backEditor = useCardEditor(card?.content.back ?? "");

  const clear = useCallback(() => {
    frontEditor?.commands.setContent("");
    backEditor?.commands.setContent("");
    frontEditor?.commands.focus();
  }, [frontEditor, backEditor]);

  return (
    <Stack spacing="2rem">
      <Stack spacing={0}>
        <Text fz="sm" fw={600}>
          Front
        </Text>
        <CardTextEditor
          editor={frontEditor}
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
          Back
        </Text>
        <CardTextEditor editor={backEditor} key="back" />
      </Stack>
      <CardEditorFooter
        finish={() => finish(mode, clear, deck, card, frontEditor, backEditor)}
        mode={mode}
      />
    </Stack>
  );
}

export default NormalCardEditor;
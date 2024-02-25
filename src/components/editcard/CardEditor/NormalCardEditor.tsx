import classes from "./NormalCardEditor.module.css";
import React, { useCallback, useEffect } from "react";
import { Stack, Text } from "@mantine/core";
import CardEditor, { useCardEditor } from "./CardEditor";
import { EditMode } from "../../../logic/CardTypeManager";
import { Card, CardType, newCard, updateCard } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import CardEditorFooter from "../CardEditorFooter";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import { Editor } from "@tiptap/react";
import {
  NormalCardUtils,
  createNormalCard,
} from "../../../logic/CardTypeImplementations/NormalCard";
import { NormalNoteContent, useNote } from "../../../logic/note";

interface NormalCardEditorProps {
  card: Card<CardType.Normal> | null;
  deck: Deck;
  mode: EditMode;
}

async function finishCard(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  card: Card<CardType.Normal> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  const cardInstance = await createCardInstance(
    deck,
    card,
    frontEditor,
    backEditor
  );
  if (cardInstance !== null) {
    if (mode === "edit") {
      //SAVE
      try {
        const numberOfUpdatedRecords = await updateCard(
          cardInstance.id,
          cardInstance
        );
        if (numberOfUpdatedRecords === 0) {
          saveFailed();
          return;
        }
        successfullySaved();
      } catch {
        saveFailed();
      }
    } else {
      //NEW
      try {
        await newCard(cardInstance, deck);
        clear && clear();
        successfullyAdded();
      } catch {
        addFailed();
      }
    }
  }
}

async function createCardInstance(
  deck: Deck,
  card: Card<CardType.Normal> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  return card
    ? NormalCardUtils.updateCard(
        {
          front: frontEditor?.getHTML() ?? "",
          back: backEditor?.getHTML() ?? "",
        },
        card
      )
    : await createNormalCard(
        deck.id,
        frontEditor?.getHTML() ?? "",
        backEditor?.getHTML() ?? ""
      );
}

function NormalCardEditor({ card, deck, mode }: NormalCardEditorProps) {
  const [requestedFinish, setRequestedFinish] = React.useState(false);

  const noteContent = card
    ? (useNote(card?.note)?.content as NormalNoteContent) ?? {}
    : { front: "[error]", back: "[error]" };

  const frontEditor = useCardEditor({
    content: noteContent.front,
    finish: () => setRequestedFinish(true),
  });

  const backEditor = useCardEditor({
    content: noteContent.back,
    finish: () => setRequestedFinish(true),
  });

  const clear = useCallback(() => {
    frontEditor?.commands.setContent("");
    backEditor?.commands.setContent("");
    frontEditor?.commands.focus();
  }, [frontEditor, backEditor]);

  useEffect(() => {
    if (requestedFinish) {
      finishCard(mode, clear, deck, card, frontEditor, backEditor);
      setRequestedFinish(false);
    }
  }, [requestedFinish, mode, clear, deck, card, frontEditor, backEditor]);

  return (
    <Stack gap="2rem">
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          Front
        </Text>
        <CardEditor
          editor={frontEditor}
          key="front"
          className={classes.front}
        />
      </Stack>
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          Back
        </Text>
        <CardEditor editor={backEditor} key="back" />
      </Stack>
      <CardEditorFooter finish={() => setRequestedFinish(true)} mode={mode} />
    </Stack>
  );
}

export default NormalCardEditor;

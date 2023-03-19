import React, { useCallback } from "react";
import { Button, Group } from "@mantine/core";
import { Card, CardType, newCard, updateCard } from "../../logic/card";
import { Deck } from "../../logic/deck";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../custom/Notification";
import { EditMode } from "../CardTypeManager";
import { useHotkeys } from "@mantine/hooks";
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react";

interface CardEditorFooterProps {
  createCardInstance: () => Card<CardType> | null;
  deck: Deck;
  mode: EditMode;
  clear?: Function;
}

export default function CardEditorFooter({
  createCardInstance,
  deck,
  mode,
  clear,
}: CardEditorFooterProps) {
  const finish = useCallback(async () => {
    const card = createCardInstance();
    if (card !== null) {
      if (mode === "edit") {
        //SAVE
        try {
          console.log(card.id);
          const numberOfUpdatedRecords = await updateCard(card.id, card);
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
          await newCard(card, deck);
          clear && clear();
          successfullyAdded();
        } catch (error) {
          addFailed();
        }
      }
    }
  }, [createCardInstance, deck, mode, clear]);

  useHotkeys([["mod+Enter", finish]]);

  return (
    <Group position="right">
      {" "}
      <Button
        onClick={finish}
        leftIcon={mode === "edit" ? <IconDeviceFloppy /> : <IconPlus />}
      >
        {mode === "edit" ? "Save" : "Add"}
      </Button>
    </Group>
  );
}

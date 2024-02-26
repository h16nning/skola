import { Stack, Text } from "@mantine/core";
import { Editor } from "@tiptap/react";
import React, { useCallback, useEffect } from "react";
import { NormalCardUtils } from "../../../logic/CardTypeImplementations/NormalCard";
import { EditMode } from "../../../logic/TypeManager";
import { CardType } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import { Note } from "../../../logic/note";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import CardEditorFooter from "../CardEditorFooter";
import classes from "./NormalCardEditor.module.css";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

interface NormalCardEditorProps {
  note: Note<CardType.Normal> | null;
  deck: Deck;
  mode: EditMode;
}

function NormalCardEditor({ note, deck, mode }: NormalCardEditorProps) {
  const [requestedFinish, setRequestedFinish] = React.useState(false);

  const noteContent = note?.content ?? {
    type: CardType.Normal,
    front: "",
    back: "",
  };

  const frontEditor = useNoteEditor({
    content: noteContent.front,
    finish: () => setRequestedFinish(true),
  });

  const backEditor = useNoteEditor({
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
      finish(mode, clear, deck, note, frontEditor, backEditor);
      setRequestedFinish(false);
    }
  }, [requestedFinish, mode, clear, deck, note, frontEditor, backEditor]);

  return (
    <Stack gap="2rem">
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          Front
        </Text>
        <NoteEditor
          editor={frontEditor}
          key="front"
          className={classes.front}
        />
      </Stack>
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          Back
        </Text>
        <NoteEditor editor={backEditor} key="back" />
      </Stack>
      <CardEditorFooter finish={() => setRequestedFinish(true)} mode={mode} />
    </Stack>
  );
}

async function finish(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  note: Note<CardType.Normal> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  if (mode === "edit") {
    //SAVE
    try {
      if (note === null) {
        throw new Error("Note is null");
      }
      await NormalCardUtils.updateNote(
        {
          front: frontEditor?.getHTML() ?? "",
          back: backEditor?.getHTML() ?? "",
        },
        note
      );
      successfullySaved();
    } catch {
      saveFailed();
    }
  } else {
    //NEW
    try {
      await NormalCardUtils.createNote(
        {
          front: frontEditor?.getHTML() ?? "",
          back: backEditor?.getHTML() ?? "",
        },
        deck
      );
      clear && clear();
      successfullyAdded();
    } catch {
      addFailed();
    }
  }
}

export default NormalCardEditor;

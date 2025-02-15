import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "@/components/Notification/Notification";
import { EditMode } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";
import { Stack, Text } from "@mantine/core";
import { Editor } from "@tiptap/react";
import { t } from "i18next";
import { useCallback, useEffect } from "react";
import { Deck } from "../../../logic/deck/deck";
import { Note } from "../../../logic/note/note";
import { BasicNoteTypeAdapter } from "../../../logic/type-implementations/normal/BasicNote";
import classes from "./NormalCardEditor.module.css";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

interface NormalCardEditorProps {
  note: Note<NoteType.Basic> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish: boolean;
  setRequestedFinish: (finish: boolean) => void;
  focusSelectNoteType?: () => void;
}

function NormalCardEditor({
  note,
  deck,
  mode,
  requestedFinish,
  setRequestedFinish,
  focusSelectNoteType,
}: NormalCardEditorProps) {
  const noteContent = note?.content ?? {
    type: NoteType.Basic,
    front: "",
    back: "",
  };

  const frontEditor = useNoteEditor({
    content: noteContent.front,
    finish: () => setRequestedFinish(true),
    focusSelectNoteType: focusSelectNoteType,
  });

  const backEditor = useNoteEditor({
    content: noteContent.back,
    finish: () => setRequestedFinish(true),
    focusSelectNoteType: focusSelectNoteType,
  });

  const clear = useCallback(() => {
    frontEditor?.commands.setContent("");
    backEditor?.commands.setContent("");
    frontEditor?.commands.focus();
  }, [frontEditor, backEditor]);

  useEffect(() => {
    if (requestedFinish) {
      console.log("requestedFinish");
      finish(mode, clear, deck, note, frontEditor, backEditor);
      setRequestedFinish(false);
      //onChanged?.(); TODO was this used?
    }
  }, [requestedFinish, mode, clear, deck, note, frontEditor, backEditor]);

  return (
    <Stack gap="2rem">
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          {t("note.edit.type-specific.normal.front")}
        </Text>
        <NoteEditor
          editor={frontEditor}
          key="front"
          className={classes.front}
        />
      </Stack>
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          {t("note.edit.type-specific.normal.back")}
        </Text>
        <NoteEditor editor={backEditor} key="back" />
      </Stack>
    </Stack>
  );
}

async function finish(
  mode: EditMode,
  clear: Function,
  deck: Deck,
  note: Note<NoteType.Basic> | null,
  frontEditor: Editor | null,
  backEditor: Editor | null
) {
  if (mode === "edit") {
    //SAVE
    try {
      if (note === null) {
        throw new Error("Note is null");
      }
      await BasicNoteTypeAdapter.updateNote(
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
      await BasicNoteTypeAdapter.createNote(
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

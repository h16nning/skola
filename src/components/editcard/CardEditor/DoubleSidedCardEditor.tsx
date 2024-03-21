import { Stack, Text } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { Editor } from "@tiptap/react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DoubleSidedCardUtils } from "../../../logic/CardTypeImplementations/DoubleSidedCard";
import { EditMode } from "../../../logic/TypeManager";
import { NoteType } from "../../../logic/card";
import { Deck } from "../../../logic/deck";
import { Note } from "../../../logic/note";
import {
  addFailed,
  saveFailed,
  successfullyAdded,
  successfullySaved,
} from "../../custom/Notification/Notification";
import classes from "./DoubleSidedCardEditor.module.css";
import NoteEditor, { useNoteEditor } from "./NoteEditor";

interface DoubleSidedCardEditorProps {
  note: Note<NoteType.DoubleSided> | null;
  deck: Deck;
  mode: EditMode;
  requestedFinish: boolean;
  setRequestedFinish: (finish: boolean) => void;
  focusSelectNoteType?: () => void;
}

function DoubleSidedCardEditor({
  note,
  deck,
  mode,
  requestedFinish,
  setRequestedFinish,
  focusSelectNoteType,
}: DoubleSidedCardEditorProps) {
  const [t] = useTranslation();

  useHotkeys([["mod+Enter", () => setRequestedFinish(true)]]);

  const noteContent = note?.content ?? {
    type: NoteType.DoubleSided,
    field1: "",
    field2: "",
  };

  const editor1 = useNoteEditor({
    content: noteContent.field1,
    finish: () => setRequestedFinish(true),
    focusSelectNoteType: focusSelectNoteType,
  });

  const editor2 = useNoteEditor({
    content: noteContent.field2,
    finish: () => setRequestedFinish(true),
    focusSelectNoteType: focusSelectNoteType,
  });

  const clear = useCallback(() => {
    editor1?.commands.setContent("");
    editor2?.commands.setContent("");
    editor1?.commands.focus();
  }, [editor1, editor2]);

  useEffect(() => {
    if (requestedFinish) {
      finish(mode, clear, deck, note, editor1, editor2);
      setRequestedFinish(false);
    }
  }, [requestedFinish, mode, clear, deck, note, editor1, editor2]);

  return (
    <Stack gap="2rem">
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          {t("cards.editor.double_sided.front")}
        </Text>
        <NoteEditor editor={editor1} key="front" className={classes} />
      </Stack>
      <Stack gap={0}>
        <Text fz="sm" fw={600}>
          {t("cards.editor.double_sided.back")}
        </Text>
        <NoteEditor editor={editor2} key="back" />
      </Stack>
    </Stack>
  );
}

async function finish(
  mode: EditMode,
  clear: () => void,
  deck: Deck,
  note: Note<NoteType.DoubleSided> | null,
  editor1: Editor | null,
  editor2: Editor | null
) {
  if (mode === "edit") {
    //SAVE
    try {
      if (!note) throw new Error("Note is null");
      await DoubleSidedCardUtils.updateNote(
        {
          field1: editor1?.getHTML() ?? "",
          field2: editor2?.getHTML() ?? "",
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
      await DoubleSidedCardUtils.createNote(
        {
          field1: editor1?.getHTML() ?? "",
          field2: editor2?.getHTML() ?? "",
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

export default DoubleSidedCardEditor;

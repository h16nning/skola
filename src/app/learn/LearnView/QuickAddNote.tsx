import {
  addFailed,
  successfullyAdded,
} from "@/components/Notification/Notification";
import { CognitivePrompt } from "@/logic/cognitivePrompts";
import { Deck } from "@/logic/deck/deck";
import { BasicNoteTypeAdapter } from "@/logic/type-implementations/normal/BasicNote";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import NoteEditor, { useNoteEditor } from "../../editor/NoteEditor/NoteEditor";
import { linkNotes } from "@/logic/note/linkNotes";

interface QuickAddNoteProps {
  sourceNoteId: string;
  deck: Deck;
  prompt: CognitivePrompt;
  onClose: () => void;
}

function QuickAddNote({
  deck,
  prompt,
  onClose,
  sourceNoteId,
}: QuickAddNoteProps) {
  const [requestedFinish, setRequestedFinish] = useState(false);

  const frontEditor = useNoteEditor({
    content: "",
    finish: () => setRequestedFinish(true),
  });

  const backEditor = useNoteEditor({
    content: "",
    finish: () => setRequestedFinish(true),
  });

  const clear = useCallback(() => {
    frontEditor?.commands.setContent("");
    backEditor?.commands.setContent("");
    frontEditor?.commands.focus();
  }, [frontEditor, backEditor]);

  const handleAdd = useCallback(async () => {
    try {
      const newNoteId = await BasicNoteTypeAdapter.createNote(
        {
          front: frontEditor?.getHTML() ?? "",
          back: backEditor?.getHTML() ?? "",
        },
        deck
      );
      if (!newNoteId) throw new Error("Failed to create note");
      linkNotes(newNoteId, sourceNoteId);
      clear();
      successfullyAdded();
      onClose();
    } catch {
      addFailed();
    }
  }, [deck, frontEditor, backEditor, clear, onClose]);

  useEffect(() => {
    if (requestedFinish) {
      handleAdd();
      setRequestedFinish(false);
    }
  }, [requestedFinish, handleAdd]);

  useEffect(() => {
    frontEditor?.commands.focus();
  }, [frontEditor]);

  return (
    <Paper
      shadow="xs"
      withBorder
      style={{
        maxWidth: 600,
        width: "100%",
      }}
      p="md"
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Text ff="heading" fs="italic">
            {prompt.description}
          </Text>
        </Group>

        <Stack gap="xs">
          <Text size="sm" fw={600}>
            {t("note.edit.type-specific.normal.front")}
          </Text>
          <NoteEditor editor={frontEditor} />
        </Stack>

        <Stack gap="xs">
          <Text size="sm" fw={600}>
            {t("note.edit.type-specific.normal.back")}
          </Text>
          <NoteEditor editor={backEditor} />
        </Stack>

        <Group justify="flex-end" gap="xs">
          <Button variant="subtle" color="gray" size="sm" onClick={onClose}>
            {t("learning.quick-add.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={
              !frontEditor?.getText().trim() || !backEditor?.getText().trim()
            }
          >
            {t("learning.quick-add.add-note")}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

export default QuickAddNote;

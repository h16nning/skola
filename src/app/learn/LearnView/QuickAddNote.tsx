import {
  addFailed,
  successfullyAdded,
} from "@/components/Notification/Notification";
import { Button } from "@/components/ui/Button";
import { Group } from "@/components/ui/Group";
import { Paper } from "@/components/ui/Paper";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";
import { CognitivePrompt } from "@/logic/cognitivePrompts";
import { Deck } from "@/logic/deck/deck";
import { linkNotes } from "@/logic/note/linkNotes";
import { BasicNoteTypeAdapter } from "@/logic/type-implementations/normal/BasicNote";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import NoteEditor, { useNoteEditor } from "../../editor/NoteEditor/NoteEditor";

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
  }, [deck, frontEditor, backEditor, clear, onClose, sourceNoteId]);

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
    <Paper shadow="xs" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="start">
          <Text
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
            }}
          >
            {prompt.description}
          </Text>
        </Group>

        <Stack gap="xs">
          <Text size="sm" weight="semibold">
            {t("note.edit.type-specific.normal.front")}
          </Text>
          <NoteEditor editor={frontEditor} />
        </Stack>

        <Stack gap="xs">
          <Text size="sm" weight="semibold">
            {t("note.edit.type-specific.normal.back")}
          </Text>
          <NoteEditor editor={backEditor} />
        </Stack>

        <Group justify="end" gap="xs">
          <Button variant="subtle" size="sm" onClick={onClose}>
            {t("learning.quick-add.cancel")}
          </Button>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={
              !frontEditor?.getText().trim() || !backEditor?.getText().trim()
            }
            variant="primary"
          >
            {t("learning.quick-add.add-note")}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

export default QuickAddNote;

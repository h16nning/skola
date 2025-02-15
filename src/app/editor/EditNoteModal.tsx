import { getAdapter } from "@/logic/NoteTypeAdapter";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { NoteType } from "@/logic/note/note";
import { Button, Group, Modal } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Note } from "../../logic/note/note";
import classes from "./EditNoteModal.module.css";
import NoteSubmitButton from "./NoteSubmitButton";

interface EditNoteModalProps {
  note: Note<NoteType>;
  opened: boolean;
  setClose: () => void;
}

export default function EditNoteModal({
  note,
  opened,
  setClose,
}: EditNoteModalProps) {
  const [deck] = useDeckOf(note);
  const navigate = useNavigate();
  const [requestedFinish, setRequestedFinish] = useState(false);

  const CardEditor = useMemo(() => {
    return deck
      ? getAdapter(note).editor({
          note,
          deck,
          mode: "edit",
          requestedFinish,
          setRequestedFinish,
        })
      : null;
  }, [note, deck, requestedFinish, setRequestedFinish]);

  return (
    <Modal
      className={classes.modal}
      title={
        <Group justify="space-between" align="center" w="100%" flex-grow>
          <span>Edit Note</span>
          <Button
            variant="subtle"
            color="gray"
            rightSection={<IconArrowUpRight />}
            onClick={() => deck && navigate(`/notes/${note.deck}/${note.id}`)}
          >
            Open In Manage Cards
          </Button>
        </Group>
      }
      opened={opened}
      onClose={setClose}
    >
      {CardEditor}
      <Group justify="end" pt="md">
        <NoteSubmitButton
          finish={() => {
            setRequestedFinish(true);
            setClose();
          }}
          mode="edit"
        />
      </Group>
    </Modal>
  );
}

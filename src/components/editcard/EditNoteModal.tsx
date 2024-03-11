import { Button, Group, Modal } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUtils } from "../../logic/TypeManager";
import { CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { Note } from "../../logic/note";
import classes from "./EditNoteModal.module.css";

interface EditNoteModalProps {
  note: Note<CardType>;
  opened: boolean;
  setClose: () => void;
  onChanged?: () => void;
}

export default function EditNoteModal({
  note,
  opened,
  setClose,
  onChanged,
}: EditNoteModalProps) {
  const [deck] = useDeckOf(note);
  const navigate = useNavigate();

  const CardEditor = useMemo(() => {
    return deck ? getUtils(note).editor(note, deck, "edit", onChanged) : null;
  }, [note, deck]);

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
    </Modal>
  );
}

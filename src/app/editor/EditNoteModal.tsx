import { getAdapter } from "@/logic/NoteTypeAdapter";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { NoteType } from "@/logic/note/note";
import { Group, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useMemo, useState } from "react";
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
  const [requestedFinish, setRequestedFinish] = useState(false);

  const isMobile = useMediaQuery("(max-width: 50em)");

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
        <Group justify="space-between" align="center" w="100%" flex-grow={1}>
          <span>Edit Note</span>
          {/*<Button
            variant="subtle"
            color="gray"
            rightSection={<IconArrowUpRight />}
            onClick={() => deck && navigate(`/notes/${note.deck}/${note.id}`)}
          >
            Open In Manage Cards
          </Button>*/}
        </Group>
      }
      fullScreen={isMobile}
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

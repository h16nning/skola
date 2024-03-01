import { Modal } from "@mantine/core";
import { useMemo } from "react";
import { CardType } from "../../logic/card";
import { useDeckOf } from "../../logic/deck";
import { getUtils } from "../../logic/TypeManager";
import { Note } from "../../logic/note";

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

  const CardEditor = useMemo(() => {
    return deck ? getUtils(note).editor(note, deck, "edit", onChanged) : null;
  }, [note, deck]);

  return (
    <Modal title={"Edit Note"} opened={opened} onClose={setClose}>
      {CardEditor}
    </Modal>
  );
}

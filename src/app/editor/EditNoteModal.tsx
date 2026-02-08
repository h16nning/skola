import { getAdapter } from "@/logic/NoteTypeAdapter";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { NoteType } from "@/logic/note/note";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useMemo, useState } from "react";
import { Note } from "../../logic/note/note";
import { Modal } from "@/components/ui/Modal";
import NoteSubmitButton from "./NoteSubmitButton";
import "./EditNoteModal.css";

const BASE = "edit-note-modal";

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
      title="Edit Note"
      fullscreen={isMobile}
      opened={opened}
      onClose={setClose}
    >
      <div className={BASE}>
        <div className={`${BASE}__content`}>{CardEditor}</div>
        <div className={`${BASE}__footer`}>
          <NoteSubmitButton
            finish={() => {
              setRequestedFinish(true);
              setClose();
            }}
            mode="edit"
          />
        </div>
      </div>
    </Modal>
  );
}

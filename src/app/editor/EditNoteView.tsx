import { Text } from "@/components/ui/Text";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteTypeLabels } from "@/logic/card/card";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { Note, NoteType } from "@/logic/note/note";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./EditNoteView.css";
import NoteMenu from "./NoteMenu";
import NoteSubmitButton from "./NoteSubmitButton";

const BASE = "edit-note";

type SetOpenedNote = (note: Note<NoteType> | undefined) => void;

export function EditNoteView({
  note,
  setOpenedNote,
}: {
  note: Note<NoteType> | undefined;
  setOpenedNote?: SetOpenedNote;
}) {
  if (!note) {
    return <NoNoteView />;
  }
  return <NoteView key={note.id} note={note} setOpenedNote={setOpenedNote} />;
}

export function NoNoteView() {
  return (
    <div className={`${BASE}__no-note`}>
      <Text size="sm" variant="dimmed">
        No note selected
      </Text>
    </div>
  );
}

function NoteView({
  note,
  setOpenedNote,
}: {
  note: Note<NoteType>;
  setOpenedNote?: SetOpenedNote;
}) {
  const [t] = useTranslation();
  const [deck] = useDeckOf(note);
  const [requestedFinish, setRequestedFinish] = useState(false);

  const NoteEditor = useMemo(() => {
    return deck ? (
      getAdapter(note).editor({
        note,
        deck,
        mode: "edit",
        requestedFinish,
        setRequestedFinish,
      })
    ) : (
      <div />
    );
  }, [note, deck, requestedFinish, setRequestedFinish]);

  return (
    <div className={BASE}>
      <div className={`${BASE}__header`}>
        <div className={`${BASE}__title-group`}>
          <Text size="xs" weight="semibold">
            {t("note.edit.title")}{" "}
            <Text variant="dimmed" size="xs" weight="semibold">
              ({NoteTypeLabels[note.content.type]})
            </Text>
          </Text>
        </div>
        <NoteMenu note={note} withEdit={false} />
      </div>
      <div className={`${BASE}__content`}>{NoteEditor}</div>
      <div className={`${BASE}__bottom-section`}>
        <NoteSubmitButton finish={() => setRequestedFinish(true)} mode="edit" />
      </div>
      {/*<LinkedNotesSection
        linkedNotes={note.linkedNotes}
        onSelectNote={
          setOpenedNote
            ? (noteId) => getNote(noteId).then((n) => n && setOpenedNote(n))
            : undefined
        }
      />*/}
    </div>
  );
}
export default EditNoteView;

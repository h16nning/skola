import { Paper } from "@/components/ui/Paper";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { updateNote } from "@/logic/note/updateNote";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useEffect } from "react";
import NoteMenu from "../editor/NoteMenu";
import classes from "./NotebookView.module.css";

interface NotebookCardProps {
  index: number;
  note: Note<NoteType>;
  useCustomSort: boolean;
  showAnswer: boolean;
}

function NotebookCard({
  note,
  index,
  useCustomSort,
  showAnswer,
}: NotebookCardProps) {
  useEffect(() => {
    if (useCustomSort) {
      updateNote(note.id, { customOrder: index });
    }
  }, [index, useCustomSort, note.id]);

  return useCustomSort ? (
    <Draggable key={note.id} index={index} draggableId={note.id}>
      {(provided, snapshot) => (
        <div
          className={`${classes.cardWrapper} ${snapshot.isDragging ? classes.dragging : ""}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <InnerCard note={note} showAnswer={showAnswer} />
        </div>
      )}
    </Draggable>
  ) : (
    <InnerCard note={note} showAnswer={showAnswer} />
  );
}
export default memo(NotebookCard);

const InnerCard = memo(
  ({ note, showAnswer }: { note: Note<NoteType>; showAnswer: boolean }) => {
    const [answerToggled, handlers] = useDisclosure(false);

    return (
      <Paper className={classes.card}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--spacing-sm)",
          }}
        >
          <button
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
            }}
            onClick={handlers.toggle}
          >
            {getAdapter(note).displayNote(
              note,
              showAnswer ? "strict" : answerToggled ? "optional" : "none"
            )}
          </button>
          <NoteMenu note={note} withShortcuts={false} />
        </div>
      </Paper>
    );
  }
);

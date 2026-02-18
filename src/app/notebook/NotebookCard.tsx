import { Paper } from "@/components/ui/Paper";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { updateNote } from "@/logic/note/updateNote";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useEffect } from "react";
import NoteMenu from "../editor/NoteMenu";

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
      {(provided) => (
        <div
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
      <Paper
        onClick={handlers.toggle}
        withBorder
        style={{ position: "relative", padding: 0, cursor: "pointer" }}
      >
        {getAdapter(note).displayNote(
          note,
          showAnswer ? "strict" : answerToggled ? "optional" : "none"
        )}
        <div
          style={{
            position: "absolute",
            top: "var(--spacing-sm)",
            right: "var(--spacing-sm)",
          }}
        >
          <NoteMenu note={note} withShortcuts={false} />
        </div>
      </Paper>
    );
  }
);

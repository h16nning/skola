import { IconButton } from "@/components/ui/IconButton";
import { Paper } from "@/components/ui/Paper";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { Draggable } from "@hello-pangea/dnd";
import { IconDots } from "@tabler/icons-react";
import { memo, useState } from "react";
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
  return useCustomSort ? (
    <Draggable key={note.id} index={index} draggableId={note.id}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`notebook__card-wrapper ${
            snapshot.isDragging ? "notebook__card-wrapper--dragging" : ""
          }`}
        >
          <InnerCard note={note} showAnswer={showAnswer} />
        </div>
      )}
    </Draggable>
  ) : (
    <div className="notebook__card-wrapper">
      <InnerCard note={note} showAnswer={showAnswer} />
    </div>
  );
}
export default memo(NotebookCard);

const InnerCard = memo(
  ({ note, showAnswer }: { note: Note<NoteType>; showAnswer: boolean }) => {
    const [answerToggled, handlers] = useDisclosure(false);
    const [hasHovered, setHasHovered] = useState(false);

    return (
      <Paper
        onClick={handlers.toggle}
        withBorder
        style={{
          position: "relative",
          padding: 0,
          cursor: "pointer",
        }}
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
          {hasHovered ? (
            <NoteMenu note={note} withShortcuts={false} />
          ) : (
            <IconButton
              variant="subtle"
              aria-label="Menu"
              onMouseEnter={() => setHasHovered(true)}
              onClick={(e) => {
                e.stopPropagation();
                setHasHovered(true);
              }}
            >
              <IconDots />
            </IconButton>
          )}
        </div>
      </Paper>
    );
  }
);

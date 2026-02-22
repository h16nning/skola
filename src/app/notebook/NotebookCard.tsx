import { Paper } from "@/components/ui/Paper";
import { IconButton } from "@/components/ui/IconButton";
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
    const [hasHovered, setHasHovered] = useState(false);

    return (
      <Paper
        onClick={handlers.toggle}
        onMouseEnter={() => setHasHovered(true)}
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
          {hasHovered ? (
            <NoteMenu note={note} withShortcuts={false} />
          ) : (
            <IconButton
              variant="subtle"
              aria-label="Menu"
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

import { IconButton } from "@/components/ui/IconButton";
import { Paper } from "@/components/ui/Paper";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { getNotePreview } from "@/logic/note/preview";
import { Draggable } from "@hello-pangea/dnd";
import { IconDots } from "@tabler/icons-react";
import { memo, useState } from "react";
import NoteMenu from "../editor/NoteMenu";

interface CardItemProps {
  index: number;
  note: Note<NoteType>;
  useCustomSort: boolean;
  showAnswer: boolean;
}

function CardItem({ note, index, useCustomSort, showAnswer }: CardItemProps) {
  return useCustomSort ? (
    <Draggable key={note.id} index={index} draggableId={note.id}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`cards-view__card-wrapper ${
            snapshot.isDragging ? "cards-view__card-wrapper--dragging" : ""
          }`}
        >
          <InnerCard note={note} showAnswer={showAnswer} />
        </div>
      )}
    </Draggable>
  ) : (
    <div className="cards-view__card-wrapper">
      <InnerCard note={note} showAnswer={showAnswer} />
    </div>
  );
}
export default memo(CardItem);

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
        <CardPreview
          note={note}
          showAnswer={showAnswer}
          answerToggled={answerToggled}
        />
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

function CardPreview({
  note,
  showAnswer,
  answerToggled,
}: {
  note: Note<NoteType>;
  showAnswer: boolean;
  answerToggled: boolean;
}) {
  if (note.content.type === NoteType.Cloze) {
    return getAdapter(note).displayNote(
      note,
      showAnswer ? "strict" : answerToggled ? "optional" : "none"
    );
  }

  const preview = getNotePreview(note);

  return (
    <div className="cards-view__preview">
      <h3 className="cards-view__preview-front">{preview.front}</h3>
      {preview.back && (
        <div className="cards-view__preview-back">{preview.back}</div>
      )}
    </div>
  );
}

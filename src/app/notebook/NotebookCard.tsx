import { Draggable } from "@hello-pangea/dnd";
import { Group, Paper } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo, useEffect } from "react";
import { getUtils } from "../../logic/TypeManager";
import { NoteType } from "../../logic/card";
import { Note, updateNote } from "../../logic/note";
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
  }, [index]);

  return useCustomSort ? (
    <Draggable key={note.id} index={index} draggableId={note.id}>
      {(provided, snapshot) => (
        <div
          className={
            classes.cardWrapper +
            " " +
            (snapshot.isDragging && classes.dragging)
          }
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
      <Paper p="md" className={classes.card}>
        <Group align="top" justify="space-between" wrap="nowrap">
          <Group align="center" w="100%" onClick={handlers.toggle}>
            {getUtils(note).displayNote(
              note,
              showAnswer ? "strict" : answerToggled ? "facultative" : "none"
            )}
          </Group>
          <NoteMenu note={note} withShortcuts={false} />
        </Group>
      </Paper>
    );
  }
);

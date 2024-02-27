import { Draggable } from "@hello-pangea/dnd";
import { Group, Paper, Tooltip } from "@mantine/core";
import { t } from "i18next";
import { memo, useEffect, useState } from "react";
import { getUtils } from "../../logic/TypeManager";
import { CardType } from "../../logic/card";
import { Note, updateNote } from "../../logic/note";
import classes from "./NotebookView.module.css";
import NoteMenu from "../editcard/NoteMenu";

interface NotebookCardProps {
  index: number;
  note: Note<CardType>;
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
  ({ note, showAnswer }: { note: Note<CardType>; showAnswer: boolean }) => {
    const [individualShowAnswer, setIndividualShowAnswer] = useState(false);

    return (
      <Tooltip
        label={t("notebook.individual-show-answer-toggle-tooltip")}
        openDelay={1000}
        offset={-10}
        disabled={showAnswer}
      >
        <Paper
          p="md"
          className={classes.card}
          onClick={() => setIndividualShowAnswer(!individualShowAnswer)}
        >
          <Group align="top" justify="space-between" wrap="nowrap">
            <Group align="center" w="100%">
              {getUtils(note).displayNote(note)}
            </Group>
            <NoteMenu note={note} withShortcuts={false} />
          </Group>
        </Paper>
      </Tooltip>
    );
  }
);

import classes from "./NotebookView.module.css";
import { Group, Paper, Tooltip } from "@mantine/core";
import { Card, CardType, updateCard } from "../../logic/card";
import { getUtils } from "../../logic/CardTypeManager";
import CardMenu from "../editcard/CardMenu";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useEffect, useState } from "react";
import { t } from "i18next";
import { useNote } from "../../logic/note";

interface NotebookCardProps {
  index: number;
  card: Card<CardType>;
  useCustomSort: boolean;
  showAnswer: boolean;
}

function NotebookCard({
  card,
  index,
  useCustomSort,
  showAnswer,
}: NotebookCardProps) {
  useEffect(() => {
    if (useCustomSort) {
      updateCard(card.id, { customOrder: index });
    }
  }, [index]);

  return useCustomSort ? (
    <Draggable key={card.id} index={index} draggableId={card.id}>
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
          <InnerCard card={card} showAnswer={showAnswer} />
        </div>
      )}
    </Draggable>
  ) : (
    <InnerCard card={card} showAnswer={showAnswer} />
  );
}
export default memo(NotebookCard);

const InnerCard = memo(
  ({ card, showAnswer }: { card: Card<CardType>; showAnswer: boolean }) => {
    const [individualShowAnswer, setIndividualShowAnswer] = useState(false);

    const noteContent = useNote(card.note)?.content;

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
              {showAnswer || individualShowAnswer
                ? getUtils(card).displayAnswer(card, noteContent)
                : getUtils(card).displayQuestion(card, noteContent)}
            </Group>
            <CardMenu card={card} />
          </Group>
        </Paper>
      </Tooltip>
    );
  }
);

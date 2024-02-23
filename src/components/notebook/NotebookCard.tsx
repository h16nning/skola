import classes from "./NotebookView.module.css";
import { Group, Paper } from "@mantine/core";
import { Card, CardType, updateCard } from "../../logic/card";
import { getUtils } from "../../logic/CardTypeManager";
import CardMenu from "../editcard/CardMenu";
import { Draggable } from "@hello-pangea/dnd";
import { memo, useEffect } from "react";

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

function InnerCard({
  card,
  showAnswer,
}: { card: Card<CardType>; showAnswer: boolean }) {
  return (
    <Paper p="md" className={classes.card}>
      <Group align="top" justify="space-between" wrap="nowrap">
        <Group align="center" w="100%">
          {showAnswer
            ? getUtils(card).displayAnswer(card)
            : getUtils(card).displayQuestion(card)}
        </Group>
        <CardMenu card={card} />
      </Group>
    </Paper>
  );
}

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
}

function NotebookCard({ card, index, useCustomSort }: NotebookCardProps) {
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
          <InnerCard card={card} />
        </div>
      )}
    </Draggable>
  ) : (
    <InnerCard card={card} />
  );
}
export default memo(NotebookCard);

function InnerCard({ card }: { card: Card<CardType> }) {
  return (
    <Paper p="xs" className={classes.card}>
      <Group align="top" justify="space-between">
        {getUtils(card).displayInNotebook(card)}
        <CardMenu card={card} />
      </Group>
    </Paper>
  );
}

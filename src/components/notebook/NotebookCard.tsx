import classes from "./NotebookView.module.css";
import { Group, Paper } from "@mantine/core";
import { Card, CardType } from "../../logic/card";
import { getUtils } from "../../logic/CardTypeManager";
import CardMenu from "../editcard/CardMenu";

interface NotebookCardProps {
  card: Card<CardType>;
}

export default function NotebookCard({ card }: NotebookCardProps) {
  return (
    <Paper className={classes.card}>
      <Group align="top" justify="space-between">
        {getUtils(card).displayInNotebook(card)}
        <CardMenu card={card} />
      </Group>
    </Paper>
  );
}

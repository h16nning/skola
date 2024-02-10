import classes from "./NotebookView.module.css";
import { Paper } from "@mantine/core";
import { Card, CardType } from "../../logic/card";
import { getUtils } from "../../logic/CardTypeManager";

interface NotebookCardProps {
  card: Card<CardType>;
}

export default function NotebookCard({ card }: NotebookCardProps) {
  return (
    <Paper className={classes.card}>
      {getUtils(card).displayInNotebook(card)}
    </Paper>
  );
}

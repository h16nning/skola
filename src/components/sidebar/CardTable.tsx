import React, { useEffect, useState } from "react";
import { Card, CardType } from "../../logic/card";
import { createStyles, Table } from "@mantine/core";
import { useDeckOf } from "../../logic/deck";

const useStyles = createStyles((theme) => ({
  table: { fontSize: "2rem !important" },
  tr: {
    borderColor: "red",
    border: "none",
    borderRadius: theme.radius.lg,
    cursor: "pointer",
    //"&:active": { transform: "scale(0.99)" },
  },
  th: { borderBottom: "none !important" },
  td: {
    fontSize: theme.fontSizes.xs + " !important",
    fontWeight: 500,
    borderTop: "none !important",
    "&:first-of-type": {
      borderTopLeftRadius: theme.radius.md,
      borderBottomLeftRadius: theme.radius.md,
    },
    "&:last-of-type": {
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
    },
  },
  selected: {
    backgroundColor: theme.colors.seaweed[6] + " !important",
    color: theme.white,
  },
}));

interface CardTableProps {
  cardSet: Card<CardType>[];
  selectedIndex: number | undefined;
  setSelectedIndex: Function;
  selectedCard: Card<CardType> | undefined;
  setSelectedCard: Function;
}

function CardTable({
  cardSet,
  selectedIndex,
  setSelectedIndex,
  selectedCard,
  setSelectedCard,
}: CardTableProps) {
  const { classes } = useStyles();
  return (
    <Table highlightOnHover striped className={classes.table}>
      <thead>
        <tr className={classes.tr}>
          <th className={classes.th}>Name</th>
          <th className={classes.th}>Type</th>
          <th className={classes.th}>Deck</th>
        </tr>
      </thead>
      <tbody>
        {cardSet.map((card, index) => (
          <CardTableItem
            card={card}
            key={index}
            index={index}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        ))}
      </tbody>
    </Table>
  );
}

function CardTableItem({
  card,
  index,
  selectedIndex,
  setSelectedIndex,
  selectedCard,
  setSelectedCard,
}: {
  card: Card<CardType>;
  index: number;
  selectedIndex: number | undefined;
  setSelectedIndex: Function;
  selectedCard: Card<CardType> | undefined;
  setSelectedCard: Function;
}) {
  const { classes, cx } = useStyles();
  const deck = useDeckOf(card);
  useEffect(() => {
    if (selectedIndex === index) {
      setSelectedCard(card);
    }
  }, [selectedIndex]);
  return (
    <tr
      className={cx(classes.tr, {
        [classes.selected]: selectedIndex === index,
      })}
      onClick={() => setSelectedIndex(index)}
      tabIndex={index}
    >
      <td className={classes.td}>
        {card.content.front.replace(/<[^>]*>/g, "")}
      </td>
      <td className={classes.td}>{card.content.type}</td>

      <td className={classes.td}>{deck?.name}</td>
    </tr>
  );
}
export default CardTable;

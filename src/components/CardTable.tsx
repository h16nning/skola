import React, { useEffect, useState } from "react";
import { Card, CardType } from "../logic/card";
import { Box, createStyles, Table, Text } from "@mantine/core";
import { useDeckOf } from "../logic/deck";
import { swap } from "../logic/ui";
import { useEventListener } from "@mantine/hooks";
import CardTableHeadItem from "./CardTableHeadItem";

const useStyles = createStyles((theme) => ({
  tableWrapper: {
    width: "100%",
    overflowX: "scroll",
  },
  table: {
    whiteSpace: "nowrap",
    fontSize: "2rem !important",
    "&:focus": { outline: "none" },
  },
  tr: {
    border: "none !important",
    borderRadius: theme.radius.lg,
    userSelect: "none",
  },
  bodyTr: {
    cursor: "pointer",
    "&:active": { transform: "scale(0.99)" },
  },
  td: {
    fontSize: theme.fontSizes.xs + " !important",
    overflow: "hidden",
    maxWidth: "15rem",
    whiteSpace: "nowrap",
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
    backgroundColor: swap(theme, "primary", 6, 8) + " !important",
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

  const ref = useEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex(
        selectedIndex !== undefined
          ? Math.min(selectedIndex + 1, cardSet.length - 1)
          : 0
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(
        selectedIndex !== undefined
          ? Math.max(selectedIndex - 1, 0)
          : cardSet.length - 1
      );
    }
  });

  const [sort, setSort] = useState<[string, boolean]>(["name", true]);

  return (
    <Box component="div" className={classes.tableWrapper}>
      <Table
        highlightOnHover
        striped
        className={classes.table}
        ref={ref}
        tabIndex={0}
      >
        <thead>
          <tr className={classes.tr}>
            <CardTableHeadItem
              name={"Name"}
              id="name"
              sort={sort}
              setSort={setSort}
            />
            <CardTableHeadItem
              name={"Type"}
              id="type"
              sort={sort}
              setSort={setSort}
            />
            <CardTableHeadItem
              name={"Deck"}
              id="deck"
              sort={sort}
              setSort={setSort}
            />
            <CardTableHeadItem
              name={"Creation Date"}
              id="creation_date"
              sort={sort}
              setSort={setSort}
            />
          </tr>
        </thead>
        {cardSet.length > 0 ? (
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
        ) : (
          <Text fz="sm" color="dimmed">
            No cards found
          </Text>
        )}
      </Table>
    </Box>
  );
}

function CardTableItem({
  card,
  index,
  selectedIndex,
  setSelectedIndex,
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

  const [deck, isReady] = useDeckOf(card);

  useEffect(() => {
    if (selectedIndex === index) {
      setSelectedCard(card);
    }
  }, [selectedIndex, setSelectedCard, index, card]);

  return (
    <tr
      className={cx(classes.tr, classes.bodyTr, {
        [classes.selected]: selectedIndex === index,
      })}
      onClick={() => setSelectedIndex(index)}
    >
      <td className={classes.td}>
        {card.content.front.replace(/<[^>]*>/g, "")}
      </td>
      <td className={classes.td}>{card.content.type}</td>

      <td className={classes.td}>{deck?.name ?? "?"}</td>
      <td className={classes.td}>{card.creationDate.toLocaleDateString()}</td>
    </tr>
  );
}
export default CardTable;

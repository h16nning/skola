import classes from "./CardTable.module.css";
import React from "react";
import { Card, CardType } from "../../logic/card";
import { Box, Table, Text } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import CardTableHeadItem from "./CardTableHeadItem";
import { CardTableItem } from "./CardTableItem";

interface CardTableProps {
  cardSet: Card<CardType>[];
  selectedIndex: number | undefined;
  setSelectedIndex: Function;
  selectedCard: Card<CardType> | undefined;
  setSelectedCard: Function;
  sort: [string, boolean];
  setSort: (sort: [string, boolean]) => void;
}

function CardTable({
  cardSet,
  selectedIndex,
  setSelectedIndex,
  selectedCard,
  setSelectedCard,
  sort,
  setSort,
}: CardTableProps) {
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

  return (
    <Box component="div" className={classes.tableWrapper}>
      <Table
        highlightOnHover
        withRowBorders={false}
        withColumnBorders={false}
        striped
        className={classes.table}
        ref={ref}
        tabIndex={0}
      >
        <thead>
          <tr className={classes.tr}>
            <CardTableHeadItem
              name={"Name"}
              id="front"
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

export default CardTable;

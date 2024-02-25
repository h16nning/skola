import classes from "./CardTable.module.css";
import React from "react";
import { Card, CardType } from "../../logic/card";
import { Stack, Table, Text } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import CardTableHeadItem from "./CardTableHeadItem";
import { CardTableItem } from "./CardTableItem";
import { SortOption } from "../../logic/card_filter";
import { useTranslation } from "react-i18next";
import { IconCards } from "@tabler/icons-react";

interface CardTableProps {
  cardSet: Card<CardType>[];
  selectedIndex: number | undefined;
  setSelectedIndex: (index: number) => void;
  selectedCard: Card<CardType> | undefined;
  setSelectedCard: (card: Card<CardType>) => void;
  sort: [SortOption, boolean];
  setSort: (sort: [SortOption, boolean]) => void;
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
  const [t] = useTranslation();
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
    <Table.ScrollContainer
      minWidth="500px"
      type="native"
      className={classes.tableScrollContainer}
    >
      <Table
        className={classes.table}
        highlightOnHover
        withRowBorders={false}
        withColumnBorders={false}
        striped
        stickyHeader
        ref={ref}
        tabIndex={0}
      >
        <Table.Thead>
          <Table.Tr className={classes.tr}>
            <CardTableHeadItem
              name={"Name"}
              id="sort_field"
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
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {cardSet.map((card, index) => (
            <CardTableItem
              card={card}
              key={card.id}
              index={index}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              selectedCard={selectedCard}
              setSelectedCard={setSelectedCard}
            />
          ))}
        </Table.Tbody>
      </Table>
      {cardSet.length === 0 && (
        <Stack align="center" p="xl">
          <IconCards size={36} strokeWidth={1.5} color="lightgray" />
          <Text fz="sm" c="dimmed">
            {t("manage-cards.table.no-cards-found")}
          </Text>
        </Stack>
      )}
    </Table.ScrollContainer>
  );
}

export default CardTable;

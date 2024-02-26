import { Table, Text } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import { NoteSortFunction, NoteSorts } from "../../logic/NoteSorting";
import { CardType } from "../../logic/card";
import { Note } from "../../logic/note";
import classes from "./CardTable.module.css";
import CardTableHeadItem from "./CardTableHeadItem";
import { NoteTableItem } from "./NoteTableItem";

interface CardTableProps {
  noteSet: Note<CardType>[];
  selectedIndex: number | undefined;
  setSelectedIndex: (index: number) => void;
  selectedNote: Note<CardType> | undefined;
  setSelectedNote: (card: Note<CardType>) => void;
  sort: [NoteSortFunction, boolean];
  setSort: (sort: [NoteSortFunction, boolean]) => void;
}

function NoteTable({
  noteSet,
  selectedIndex,
  setSelectedIndex,
  selectedNote,
  setSelectedNote,
  sort,
  setSort,
}: CardTableProps) {
  const ref = useEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex(
        selectedIndex !== undefined
          ? Math.min(selectedIndex + 1, noteSet.length - 1)
          : 0
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(
        selectedIndex !== undefined
          ? Math.max(selectedIndex - 1, 0)
          : noteSet.length - 1
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
              sortFunction={NoteSorts.bySortField}
              sort={sort}
              setSort={setSort}
            />
            <CardTableHeadItem
              name={"Type"}
              sortFunction={NoteSorts.byType}
              sort={sort}
              setSort={setSort}
            />
            <CardTableHeadItem
              name={"Deck"}
              sortFunction={NoteSorts.byDeckName}
              sort={sort}
              setSort={setSort}
            />
            <CardTableHeadItem
              name={"Creation Date"}
              sortFunction={NoteSorts.byCreationDate}
              sort={sort}
              setSort={setSort}
            />
          </Table.Tr>
        </Table.Thead>
        {noteSet.length > 0 ? (
          <Table.Tbody>
            {noteSet.map((note, index) => (
              <NoteTableItem
                note={note}
                key={note.id}
                index={index}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
              />
            ))}
          </Table.Tbody>
        ) : (
          <Text fz="sm" c="dimmed">
            No cards found
          </Text>
        )}
      </Table>
    </Table.ScrollContainer>
  );
}

export default NoteTable;

import { NoteType } from "@/logic/note/note";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { Table } from "@mantine/core";
import { useEventListener } from "@mantine/hooks";
import { IconCards } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect } from "react";
import EmptyNotice from "../../components/EmptyNotice";
import { Note } from "../../logic/note/note";
import classes from "./NoteTable.module.css";
import NoteTableHeadItem from "./NoteTableHeadItem";
import { NoteTableItem } from "./NoteTableItem";

interface CardTableProps {
  noteSet: Note<NoteType>[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectedNote: Note<NoteType> | undefined;
  setSelectedNote: (card: Note<NoteType>) => void;
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

  //Set the selected index to 0 if there is no selected index (i.e. on page load)
  useEffect(() => {
    if (selectedIndex === -1) {
      setSelectedIndex(0);
    }
  }, [selectedIndex]);

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
            <NoteTableHeadItem
              name={"Name"}
              sortFunction={NoteSorts.bySortField}
              sort={sort}
              setSort={setSort}
            />
            <NoteTableHeadItem
              name={"Type"}
              sortFunction={NoteSorts.byType}
              sort={sort}
              setSort={setSort}
            />
            <NoteTableHeadItem
              name={"Deck"}
              sortFunction={NoteSorts.byDeckName}
              sort={sort}
              setSort={setSort}
            />
            <NoteTableHeadItem
              name={"Creation Date"}
              sortFunction={NoteSorts.byCreationDate}
              sort={sort}
              setSort={setSort}
            />
          </Table.Tr>
        </Table.Thead>
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
      </Table>
      {noteSet.length === 0 && (
        <EmptyNotice
          icon={IconCards}
          description={t("manage-cards.table.no-cards-found")}
          hideTitle
          p="xl"
        />
      )}
    </Table.ScrollContainer>
  );
}

export default NoteTable;

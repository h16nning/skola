import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Note, NoteType } from "@/logic/note/note";
import {
  NoteSortFunction,
  NoteSorts,
  NoteWithComparableDeckName,
  getNotesWithComparableDeckName,
} from "@/logic/note/sort";
import { IconDots } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NoteTableHeadItem from "./NoteTableHeadItem";
import { NoteTableItem } from "./NoteTableItem";
import "./NoteTable.css";
import { IconButton } from "@/components/ui/IconButton";

const BASE = "note-table";

interface NoteTableProps {
  noteSet: Note<NoteType>[];
  sort: [NoteSortFunction, boolean];
  setSort: (sort: [NoteSortFunction, boolean]) => void;
  openedNote: Note<NoteType> | undefined;
  selectedNoteIds: Set<string>;
  onNoteClick: (
    note: Note<NoteType>,
    index: number,
    event: React.MouseEvent
  ) => void;
  onSetRowRef: (index: number, element: HTMLTableRowElement | null) => void;
  openModal: () => void;
}

interface ColumnConfig {
  key: string;
  name: string;
  sortFunction: NoteSortFunction;
  visible: boolean;
}

function NoteTable({
  noteSet,
  sort,
  setSort,
  openedNote,
  selectedNoteIds,
  onNoteClick,
  onSetRowRef,
  openModal,
}: NoteTableProps) {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { t } = useTranslation();

  const [notesWithDeckNames, setNotesWithDeckNames] = useState<
    NoteWithComparableDeckName[]
  >([]);
  const [columns, setColumns] = useState<ColumnConfig[]>([
    {
      key: "name",
      name: "Name",
      sortFunction: NoteSorts.bySortField,
      visible: true,
    },
    {
      key: "creationDate",
      name: "Creation Date",
      sortFunction: NoteSorts.byCreationDate,
      visible: true,
    },
    {
      key: "noteType",
      name: "Note Type",
      sortFunction: NoteSorts.byType,
      visible: true,
    },
    {
      key: "deckName",
      name: "Deck Name",
      sortFunction: NoteSorts.byDeckName,
      visible: true,
    },
  ]);

  useEffect(() => {
    getNotesWithComparableDeckName(noteSet).then((notes) => {
      const sorted = notes.sort(sort[0](sort[1] ? 1 : -1));
      setNotesWithDeckNames(sorted);
    });
  }, [noteSet, sort]);

  const noteTypeLabels: Record<NoteType, string> = {
    [NoteType.Basic]: t("note.type.normal"),
    [NoteType.Cloze]: t("note.type.cloze"),
    [NoteType.ImageOcclusion]: t("note.type.image-occlusion"),
    [NoteType.DoubleSided]: t("note.type-double-sided"),
    [NoteType.Undefined]: t("note.type.undefined"),
  };

  const visibleColumns = columns.filter((col) => col.visible);
  const displayNotes =
    notesWithDeckNames.length > 0 ? notesWithDeckNames : noteSet;

  function handleRowSelect(
    note: Note<NoteType>,
    index: number,
    event: React.MouseEvent
  ) {
    onNoteClick(note, index, event);
    if (isMobile && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
      openModal();
    }
  }

  function handleRowOpen() {
    openModal();
  }

  function toggleColumn(columnKey: string) {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  }

  return (
    <div className={BASE}>
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}
      >
        <Menu closeOnItemClick={false}>
          <MenuTrigger>
            <IconButton>
              <IconDots />
            </IconButton>
          </MenuTrigger>
          <MenuDropdown>
            {columns.map((column) => (
              <MenuItem
                key={column.key}
                onClick={() => toggleColumn(column.key)}
                checked={column.visible}
              >
                {column.name}
              </MenuItem>
            ))}
          </MenuDropdown>
        </Menu>
      </div>
      <table className={`${BASE}__table`}>
        <thead className={`${BASE}__head`}>
          <tr>
            {visibleColumns.map((column) => (
              <NoteTableHeadItem
                key={column.key}
                name={column.name}
                sortFunction={column.sortFunction}
                sort={sort}
                setSort={setSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className={`${BASE}__body`}>
          {displayNotes.length === 0 ? (
            <tr>
              <td className={`${BASE}__empty`} colSpan={visibleColumns.length}>
                No notes found
              </td>
            </tr>
          ) : (
            displayNotes.map((note, index) => (
              <NoteTableItem
                key={note.id}
                note={note}
                index={index}
                isSelected={selectedNoteIds.has(note.id)}
                isOpened={note.id === openedNote?.id}
                onSelect={(event) => handleRowSelect(note, index, event)}
                onOpen={handleRowOpen}
                onSetRef={onSetRowRef}
                noteTypeLabels={noteTypeLabels}
                visibleColumns={visibleColumns}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NoteTable;

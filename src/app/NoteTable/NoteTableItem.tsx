import { Note, NoteType } from "@/logic/note/note";
import { NoteWithComparableDeckName } from "@/logic/note/sort";
import { memo } from "react";

const BASE = "note-table";

interface ColumnConfig {
  key: string;
  name: string;
  sortFunction: any;
  visible: boolean;
}

interface NoteTableItemProps {
  note: Note<NoteType> | NoteWithComparableDeckName;
  index: number;
  isSelected: boolean;
  isOpened: boolean;
  onNoteClick: (
    note: Note<NoteType>,
    index: number,
    event: React.MouseEvent
  ) => void;
  onOpen: () => void;
  onSetRef: (index: number, element: HTMLTableRowElement | null) => void;
  noteTypeLabels: Record<NoteType, string>;
  visibleColumns: ColumnConfig[];
  isMobile: boolean;
  openModal: () => void;
}

export const NoteTableItem = memo(
  function NoteTableItem({
    note,
    index,
    isSelected,
    isOpened,
    onNoteClick,
    onOpen,
    onSetRef,
    noteTypeLabels,
    visibleColumns,
    isMobile,
    openModal,
  }: NoteTableItemProps) {
    const classes = [
      `${BASE}__row`,
      isSelected ? `${BASE}__row--selected` : "",
      isOpened ? `${BASE}__row--opened` : "",
    ]
      .filter(Boolean)
      .join(" ");

    const noteWithDeckName = note as NoteWithComparableDeckName;

    const getCellContent = (columnKey: string) => {
      switch (columnKey) {
        case "name":
          return note.sortField;
        case "creationDate":
          return note.creationDate.toLocaleDateString();
        case "noteType":
          return noteTypeLabels[note.content.type];
        case "deckName":
          return noteWithDeckName.deckName || "";
        default:
          return "";
      }
    };

    const handleClick = (event: React.MouseEvent) => {
      onNoteClick(note, index, event);
      if (isMobile && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
        openModal();
      }
    };

    const handleRef = (el: HTMLTableRowElement | null) => {
      onSetRef(index, el);
    };

    return (
      <tr
        ref={handleRef}
        className={classes}
        onClick={handleClick}
        onDoubleClick={onOpen}
      >
        {visibleColumns.map((column) => (
          <td key={column.key} className={`${BASE}__cell`}>
            {getCellContent(column.key)}
          </td>
        ))}
      </tr>
    );
  },
  (prevProps, nextProps) => {
    const prevNote = prevProps.note as NoteWithComparableDeckName;
    const nextNote = nextProps.note as NoteWithComparableDeckName;

    return (
      prevProps.note.id === nextProps.note.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isOpened === nextProps.isOpened &&
      prevProps.visibleColumns === nextProps.visibleColumns &&
      prevNote.deckName === nextNote.deckName
    );
  }
);

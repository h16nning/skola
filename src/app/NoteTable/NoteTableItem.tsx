import { Note, NoteType } from "@/logic/note/note";
import { NoteWithComparableDeckName } from "@/logic/note/sort";

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
  onSelect: (event: React.MouseEvent) => void;
  onOpen: () => void;
  onSetRef: (index: number, element: HTMLTableRowElement | null) => void;
  noteTypeLabels: Record<NoteType, string>;
  visibleColumns: ColumnConfig[];
}

export function NoteTableItem({
  note,
  index,
  isSelected,
  isOpened,
  onSelect,
  onOpen,
  onSetRef,
  noteTypeLabels,
  visibleColumns,
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

  return (
    <tr
      ref={el => {
        onSetRef(index, el);
      }}
      className={classes}
      onClick={onSelect}
      onDoubleClick={onOpen}
    >
      {visibleColumns.map((column) => (
        <td key={column.key} className={`${BASE}__cell`}>
          {getCellContent(column.key)}
        </td>
      ))}
    </tr>
  );
}

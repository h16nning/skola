import { NoteTypeLabels } from "@/logic/card/card";
import { Note, NoteType } from "@/logic/note/note";

const BASE = "note-table";

interface NoteTableItemProps {
  note: Note<NoteType>;
  index: number;
  isSelected: boolean;
  isOpened: boolean;
  onSelect: (event: React.MouseEvent) => void;
  onOpen: () => void;
  onSetRef: (index: number, element: HTMLTableRowElement | null) => void;
}

export function NoteTableItem({
  note,
  index,
  isSelected,
  isOpened,
  onSelect,
  onOpen,
  onSetRef,
}: NoteTableItemProps) {
  const classes = [
    `${BASE}__row`,
    isSelected ? `${BASE}__row--selected` : "",
    isOpened ? `${BASE}__row--opened` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr
      ref={(el) => onSetRef(index, el)}
      className={classes}
      onClick={onSelect}
      onDoubleClick={onOpen}
    >
      <td className={`${BASE}__cell`}>{note.sortField}</td>
      <td className={`${BASE}__cell`}>
        {note.creationDate.toLocaleDateString()}
      </td>
      <td className={`${BASE}__cell`}>{NoteTypeLabels[note.content.type]}</td>
    </tr>
  );
}

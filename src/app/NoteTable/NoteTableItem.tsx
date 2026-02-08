import { Note, NoteType } from "@/logic/note/note";
import { NoteTypeLabels } from "@/logic/card/card";

const BASE = "note-table";

interface NoteTableItemProps {
  note: Note<NoteType>;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function NoteTableItem({
  note,
  isSelected,
  onSelect,
  onOpen,
}: NoteTableItemProps) {
  const classes = [
    `${BASE}__row`,
    isSelected ? `${BASE}__row--selected` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr
      className={classes}
      onClick={onSelect}
      onDoubleClick={onOpen}
    >
      <td className={`${BASE}__cell`}>{note.sortField}</td>
      <td className={`${BASE}__cell`}>
        {note.creationDate.toLocaleDateString()}
      </td>
      <td className={`${BASE}__cell`}>
        {NoteTypeLabels[note.content.type]}
      </td>
    </tr>
  );
}

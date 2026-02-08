import { NoteSortFunction } from "@/logic/note/sort";
import { IconArrowUp } from "@tabler/icons-react";

const BASE = "note-table";

interface NoteTableHeadItemProps {
  name: string;
  sortFunction: NoteSortFunction;
  sort: [NoteSortFunction, boolean];
  setSort: (sort: [NoteSortFunction, boolean]) => void;
}

export default function NoteTableHeadItem({
  name,
  sortFunction,
  sort,
  setSort,
}: NoteTableHeadItemProps) {
  const isActive = sort[0] === sortFunction;
  const isDescending = isActive && !sort[1];

  const classes = [
    `${BASE}__head-cell`,
    isActive ? `${BASE}__head-cell--active` : "",
    isDescending ? `${BASE}__head-cell--desc` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <th
      className={classes}
      onClick={() => setSort([sortFunction, isActive ? !sort[1] : true])}
    >
      <span className={`${BASE}__head-cell-content`}>
        <span>{name}</span>
        <span className={`${BASE}__sort-icon`}>
          <IconArrowUp size={14} />
        </span>
      </span>
    </th>
  );
}

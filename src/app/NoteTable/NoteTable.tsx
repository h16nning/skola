import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Note, NoteType } from "@/logic/note/note";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import "./NoteTable.css";
import NoteTableHeadItem from "./NoteTableHeadItem";
import { NoteTableItem } from "./NoteTableItem";

const BASE = "note-table";

interface NoteTableProps {
  noteSet: Note<NoteType>[];
  sort: [NoteSortFunction, boolean];
  setSort: (sort: [NoteSortFunction, boolean]) => void;
  openedNote: Note<NoteType> | undefined;
  setOpenedNote: (note: Note<NoteType> | undefined) => void;
  openModal: () => void;
}

function NoteTable({
  noteSet,
  sort,
  setSort,
  openedNote,
  setOpenedNote,
  openModal,
}: NoteTableProps) {
  const isMobile = useMediaQuery("(max-width: 50em)");

  function handleRowSelect(note: Note<NoteType>) {
    setOpenedNote(note);
    if (isMobile) {
      openModal();
    }
  }

  function handleRowOpen(note: Note<NoteType>) {
    setOpenedNote(note);
    openModal();
  }

  return (
    <div className={BASE}>
      <table className={`${BASE}__table`}>
        <thead className={`${BASE}__head`}>
          <tr>
            <NoteTableHeadItem
              name="Name"
              sortFunction={NoteSorts.bySortField}
              sort={sort}
              setSort={setSort}
            />
            <NoteTableHeadItem
              name="Creation Date"
              sortFunction={NoteSorts.byCreationDate}
              sort={sort}
              setSort={setSort}
            />
            <NoteTableHeadItem
              name="Note Type"
              sortFunction={NoteSorts.byType}
              sort={sort}
              setSort={setSort}
            />
          </tr>
        </thead>
        <tbody className={`${BASE}__body`}>
          {noteSet.length === 0 ? (
            <tr>
              <td className={`${BASE}__empty`} colSpan={3}>
                No notes found
              </td>
            </tr>
          ) : (
            noteSet.map((note) => (
              <NoteTableItem
                key={note.id}
                note={note}
                isSelected={note.id === openedNote?.id}
                onSelect={() => handleRowSelect(note)}
                onOpen={() => handleRowOpen(note)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NoteTable;

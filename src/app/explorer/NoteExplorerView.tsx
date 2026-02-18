import { AppHeaderContent } from "@/app/shell/Header/Header";
import { AppBreadcrumbs } from "@/components/AppBreadcrumbs";
import SelectDecksHeader from "@/components/SelectDecksHeader";
import { TextInput } from "@/components/ui";
import { useDebouncedState } from "@/lib/hooks/useDebouncedState";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { getNote } from "@/logic/note/getNote";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { IconSearch } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NoteTable from "../NoteTable/NoteTable";
import EditNoteModal from "../editor/EditNoteModal";
import { EditNoteView } from "../editor/EditNoteView";
import { useNoteSelection } from "./hooks/useNoteSelection";
import "./NoteExplorerView.css";

const BASE = "note-explorer-view";
const ALL_DECKS_ID = "all";

function NoteExplorerView() {
  useDocumentTitle(`${t("manage-cards.title")} | Skola`);
  const navigate = useNavigate();
  const location = useLocation();

  const [decks] = useDecks();
  let deckId = useParams().deckId;
  if (deckId === ALL_DECKS_ID) deckId = undefined;

  const noteId = useParams().noteId;

  const {
    sortFunction,
    sortDirection,
  }: { sortFunction?: keyof typeof NoteSorts; sortDirection?: boolean } =
    location.state ?? {};

  const [filter, setFilter, immediateFilter] = useDebouncedState<string>(
    "",
    50
  );

  const [sort, setSort] = useState<[NoteSortFunction, boolean]>([
    sortFunction !== undefined
      ? NoteSorts[sortFunction]
      : NoteSorts.bySortField,
    sortDirection !== undefined ? sortDirection : true,
  ]);

  const [notes] = useNotesWith(
    (n) =>
      n
        .orderBy("sortField")
        .filter(
          (note) =>
            note.sortField.toLowerCase().includes(filter.toLowerCase()) &&
            (deckId === undefined || note.deck === deckId)
        )
        .toArray()
        .then((m) => m.sort(sort[0](sort[1] ? 1 : -1))),
    [location, filter, sort]
  );

  const [editNoteModalOpened, setEditNoteModalOpened] =
    useState<boolean>(false);

  const {
    selectedNoteIds,
    openedNote,
    setOpenedNote,
    handleNoteClick,
    handleKeyDown,
    setRowRef,
  } = useNoteSelection({ notes });

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (noteId) {
      getNote(noteId).then((note) => {
        if (note) {
          setOpenedNote(note);
        }
      });
    }
  }, [noteId, setOpenedNote]);

  useEffect(() => {
    const element = tableRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown);
      return () => element.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  return (
    <div className={BASE}>
      <AppHeaderContent>
        <AppBreadcrumbs segments={[{ label: t("manage-cards.title") }]} />
      </AppHeaderContent>

      <div className={`${BASE}__controls`}>
        <SelectDecksHeader
          label="Showing Notes in"
          decks={decks}
          onSelect={(deckId) => navigate(`/notes/${deckId}`)}
        />

        <TextInput
          leftSection={<IconSearch size={16} />}
          value={immediateFilter}
          placeholder="Filter Notes"
          onChange={(event) => setFilter(event.currentTarget.value)}
        />
      </div>

      <div className={`${BASE}__container`}>
        <section
          className={`${BASE}__table-section`}
          ref={tableRef}
          tabIndex={0}
          aria-label="Note list"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
            }
          }}
        >
          {notes && (
            <NoteTable
              noteSet={notes ?? []}
              openedNote={openedNote}
              selectedNoteIds={selectedNoteIds}
              onNoteClick={handleNoteClick}
              onSetRowRef={setRowRef}
              openModal={() => setEditNoteModalOpened(true)}
              sort={sort}
              setSort={setSort}
            />
          )}
        </section>

        <section className={`${BASE}__note-display`}>
          <EditNoteView note={openedNote} setOpenedNote={setOpenedNote} />
        </section>
      </div>

      {openedNote && (
        <EditNoteModal
          note={openedNote}
          setClose={() => setEditNoteModalOpened(false)}
          opened={editNoteModalOpened}
        />
      )}
    </div>
  );
}

export default NoteExplorerView;

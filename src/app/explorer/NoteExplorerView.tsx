import { AppHeaderContent } from "@/app/shell/Header/Header";
import { AppBreadcrumbs } from "@/components/AppBreadcrumbs";
import { useDebouncedState } from "@/lib/hooks/useDebouncedState";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { getNote } from "@/logic/note/getNote";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { t } from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NoteTable from "../NoteTable/NoteTable";
import EditNoteModal from "../editor/EditNoteModal";
import { EditNoteView } from "../editor/EditNoteView";
import { NoteExplorerControls } from "./NoteExplorerControls";
import { useNoteSelection } from "./hooks/useNoteSelection";
import "./NoteExplorerView.css";

const BASE = "note-explorer-view";
const ALL_DECKS_ID = "all";

type SortKey = keyof typeof NoteSorts;

function isValidSortKey(key: string | null): key is SortKey {
  return key !== null && key in NoteSorts;
}

function NoteExplorerView() {
  useDocumentTitle(`${t("manage-cards.title")} | Skola`);
  const [searchParams, setSearchParams] = useSearchParams();

  const deckParam = searchParams.get("deck");
  const noteParam = searchParams.get("note");
  const sortParam = searchParams.get("sort");
  const sortDirParam = searchParams.get("sortDir");

  const deckId =
    deckParam === ALL_DECKS_ID ? undefined : (deckParam ?? undefined);

  const [decks] = useDecks();

  const [filter, setFilter, immediateFilter] = useDebouncedState<string>(
    "",
    50
  );

  const initialSortFunction: NoteSortFunction =
    sortParam && isValidSortKey(sortParam)
      ? NoteSorts[sortParam]
      : NoteSorts.bySortField;
  const initialSortDirection =
    sortDirParam !== null ? sortDirParam === "asc" : true;

  const [sort, setSortState] = useState<[NoteSortFunction, boolean]>([
    initialSortFunction,
    initialSortDirection,
  ]);

  const setSort = useCallback(
    (newSort: [NoteSortFunction, boolean]) => {
      setSortState(newSort);
      const sortKey = Object.entries(NoteSorts).find(
        ([, fn]) => fn === newSort[0]
      )?.[0];
      if (sortKey) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("sort", sortKey);
          next.set("sortDir", newSort[1] ? "asc" : "desc");
          return next;
        });
      }
    },
    [setSearchParams]
  );

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
    [deckId, filter, sort]
  );

  const [editNoteModalOpened, setEditNoteModalOpened] =
    useState<boolean>(false);

  const openModal = useCallback(() => {
    setEditNoteModalOpened(true);
  }, []);

  const closeModal = useCallback(() => {
    setEditNoteModalOpened(false);
  }, []);

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
    if (noteParam) {
      getNote(noteParam).then((note) => {
        if (note) {
          setOpenedNote(note);
        }
      });
    }
  }, [noteParam, setOpenedNote]);

  useEffect(() => {
    const element = tableRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown);
      return () => element.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  const handleDeckSelect = useCallback(
    (selectedDeckId: string | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (!selectedDeckId || selectedDeckId === ALL_DECKS_ID) {
          next.delete("deck");
        } else {
          next.set("deck", selectedDeckId);
        }
        next.delete("note");
        return next;
      });
    },
    [setSearchParams]
  );

  return (
    <div className={BASE}>
      <AppHeaderContent>
        <AppBreadcrumbs segments={[{ label: t("manage-cards.title") }]} />
      </AppHeaderContent>

      <NoteExplorerControls
        decks={decks}
        selectedDeckParam={deckParam ?? ""}
        onDeckSelect={handleDeckSelect}
        filterValue={immediateFilter}
        onFilterChange={setFilter}
      />

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
              openModal={openModal}
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
          setClose={closeModal}
          opened={editNoteModalOpened}
        />
      )}
    </div>
  );
}

export default NoteExplorerView;

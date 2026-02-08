import { AppHeaderContent } from "@/app/shell/Header/Header";
import SelectDecksHeader from "@/components/SelectDecksHeader";
import { TextInput } from "@/components/ui";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { getNote } from "@/logic/note/getNote";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { Note, NoteType } from "@/logic/note/note";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { useDebouncedState } from "@/lib/hooks/useDebouncedState";
import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { IconSearch } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NoteTable from "../NoteTable/NoteTable";
import EditNoteModal from "../editor/EditNoteModal";
import { EditNoteView } from "../editor/EditNoteView";
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

  const [filter, setFilter, immediateFilter] = useDebouncedState<string>("", 250);

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

  const [openedNote, setOpenedNote] = useState<Note<NoteType> | undefined>();

  useEffect(() => {
    if (noteId) {
      getNote(noteId).then((note) => {
        if (note) {
          setOpenedNote(note);
        }
      });
    }
  }, [noteId]);

  return (
    <div className={BASE}>
      <AppHeaderContent>
        <h3 className={`${BASE}__title`}>{t("manage-cards.title")}</h3>
      </AppHeaderContent>

      <div className={`${BASE}__controls`}>
        <SelectDecksHeader
          label="Showing Notes in"
          decks={decks}
          onSelect={(deckId) => navigate(`/notes/${deckId}`)}
        />
      </div>

      <div className={`${BASE}__container`}>
        <div className={`${BASE}__table-section`}>
          <TextInput
            leftSection={<IconSearch size={16} />}
            value={immediateFilter}
            placeholder="Filter Notes"
            onChange={(event) => setFilter(event.currentTarget.value)}
          />
          {notes && (
            <NoteTable
              noteSet={notes ?? []}
              openedNote={openedNote}
              setOpenedNote={setOpenedNote}
              openModal={() => setEditNoteModalOpened(true)}
              sort={sort}
              setSort={setSort}
            />
          )}
        </div>

        <div className={`${BASE}__note-display`}>
          <EditNoteView note={openedNote} setOpenedNote={setOpenedNote} />
        </div>
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

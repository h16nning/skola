import NoteTable from "../NoteTable/NoteTable";
import EditorOptionsMenu from "@/app/editor/EditorOptionsMenu";
import { AppHeaderContent } from "@/app/shell/Header/Header";
import SelectDecksHeader from "@/components/SelectDecksHeader";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { getNote } from "@/logic/note/getNote";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { Note, NoteType } from "@/logic/note/note";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { Box, Group, Space, Stack, TextInput, Title } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditNoteModal from "../editor/EditNoteModal";
import { EditNoteView } from "../editor/EditNoteView";
import classes from "./NoteExplorerView.module.css";

const ALL_DECKS_ID = "all";

function NoteExplorerView() {

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


  const [filter, setFilter] = useDebouncedState<string>("", 250);

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
        .filter((note) =>
          note.sortField.toLowerCase().includes(filter.toLowerCase())
        )
        .toArray()
        .then((m) => m.sort(sort[0](sort[1] ? 1 : -1))),
    [location, filter, location, sort]
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
    <Stack
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <AppHeaderContent>
        <AppHeaderContent>
          <Group justify="space-between" gap="xs" wrap="nowrap">
            <Space />
            <Title order={3}>{t("manage-cards.title")}</Title>
            <EditorOptionsMenu />
          </Group>
        </AppHeaderContent>
      </AppHeaderContent>
      <Group align="end" gap="xs">
        <SelectDecksHeader
          label="Showing Notes in"
          decks={decks}
          onSelect={(deckId) => navigate(`/notes/${deckId}`)}
        />
      </Group>
      <div
        className={classes.container}
      >
        <Stack>
          <TextInput
            leftSection={<IconSearch size={16} />}
            defaultValue={filter}
            placeholder="Filter Notes"
            w="100%"
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
        </Stack>
        <Box className={classes.noteDisplay}>
          <EditNoteView note={openedNote} />
        </Box>
      </div>
      {openedNote && (
        <EditNoteModal
          note={openedNote}
          setClose={() => setEditNoteModalOpened(false)}
          opened={editNoteModalOpened}
        />
      )}
    </Stack>
  );
}

export default NoteExplorerView;

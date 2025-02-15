import NoteTable from "@/app/CardTable/NoteTable";
import EditorOptionsMenu from "@/app/editor/EditorOptionsMenu";
import { AppHeaderContent } from "@/app/shell/Header/Header";
import SelectDecksHeader from "@/components/SelectDecksHeader";
import { NoteSortFunction, NoteSorts } from "@/logic/NoteSorting";
import { getUtils } from "@/logic/TypeManager";
import { useDecks } from "@/logic/deck";
import { useNotesWith } from "@/logic/note";
import { Group, Space, Stack, TextInput, Title } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./NoteManagerView.module.css";

const ALL_DECK_ID = "all";

function NoteManagerView() {
  const navigate = useNavigate();
  const noteId = useParams().noteId;
  let deckId = useParams().deckId;
  if (deckId === ALL_DECK_ID) deckId = undefined;

  const location = useLocation();

  const {
    sortFunction,
    sortDirection,
  }: { sortFunction?: keyof typeof NoteSorts; sortDirection?: boolean } =
    location.state ?? {};

  const [decks] = useDecks();

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
        .toArray()
        .then((m) =>
          m
            .filter((note) =>
              getUtils(note)
                .getSortFieldFromNoteContent(note.content)
                .toLowerCase()
                .includes(filter.toLowerCase())
            )
            .sort(sort[0](sort[1] ? 1 : -1))
        ),
    [location, filter, location, sort]
  );

  return (
    <Stack style={{ overflow: "hidden", width: "100%", height: "100%" }}>
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

      <Group
        gap="md"
        grow
        align="start"
        style={{ overflowY: "scroll", height: "100%" }}
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
              selectedIndex={notes.findIndex((note) => noteId === note?.id)}
              setSelectedIndex={(idx) => {
                const n = notes[idx];
                if (!n) return;
                navigate(`/notes/${deckId || ALL_DECK_ID}/${n.id}`);
              }}
              selectedNote={notes.find((note) => noteId === note?.id)}
              setSelectedNote={(note) => {
                // avoid navigating to the same note
                if (noteId !== note?.id)
                  navigate(`/notes/${deckId || ALL_DECK_ID}/${note.id}`);
              }}
              sort={sort}
              setSort={setSort}
            />
          )}
        </Stack>
        <Stack className={classes.cardBox}>
          <Outlet />
        </Stack>
      </Group>
    </Stack>
  );
}

export default NoteManagerView;

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ActionIcon, Group, Paper, Select, Space, Stack } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import { getUtilsOfType } from "../../logic/TypeManager";
import { NoteType } from "../../logic/card";
import { useDeckFromUrl, useDecks } from "../../logic/deck";

import { AppHeaderContent } from "../Header/Header";
import MissingObject from "../custom/MissingObject";
import SelectDecksHeader from "../custom/SelectDecksHeader";
import EditorOptionsMenu from "./EditorOptionsMenu";
import NewNotesFooter from "./NewNotesFooter";
import classes from "./NewNotesView.module.css";

function NewNotesView() {
  const navigate = useNavigate();

  const [decks] = useDecks();
  const [deck, isReady] = useDeckFromUrl();
  const [noteType, setNoteType] = useState<NoteType>(NoteType.Normal);
  const [requestedFinish, setRequestedFinish] = useState(false);

  const CardEditor = useMemo(() => {
    return deck
      ? getUtilsOfType(noteType).editor({
          note: null,
          deck: deck,
          mode: "new",
          requestedFinish,
          setRequestedFinish,
          setNoteType,
        })
      : null;
  }, [deck, noteType, requestedFinish, setRequestedFinish]);

  const closeView = useCallback(() => {
    navigate(deck ? "/deck/" + deck?.id : "/home");
  }, [navigate, deck]);

  if (isReady && !deck) {
    return <MissingObject />;
  }

  if (!deck) {
    return null;
  }

  return (
    <div className={classes.newNotesView}>
      <div className={classes.newNotesMain}>
        <AppHeaderContent>
          <Group justify="space-between" gap="xs" wrap="nowrap">
            <ActionIcon onClick={closeView} variant="subtle" color="gray">
              <IconChevronLeft />
            </ActionIcon>
            <EditorOptionsMenu />
          </Group>
        </AppHeaderContent>

        <Space h="md" />
        <div className={classes.newNotesEditorContainer}>
          <Stack>
            <Group justify="space-between">
              <Group gap="xs" align="end">
                <SelectDecksHeader
                  label="Adding cards to"
                  decks={decks}
                  disableAll
                  onSelect={(deckId) => navigate(`/new/${deckId}`)}
                />
              </Group>
              <Select
                value={noteType}
                onChange={(type) =>
                  setNoteType((type as NoteType) ?? NoteType.Normal)
                }
                label="Card Type"
                data={[
                  { label: "Normal", value: NoteType.Normal },
                  { label: "Double Sided", value: NoteType.DoubleSided },
                  { label: "Cloze (In Development)", value: NoteType.Cloze },
                  {
                    label: "Image Occlusion (Not Working)",
                    value: NoteType.ImageOcclusion,
                  },
                ]}
              />
            </Group>
            <Paper p="md" shadow="xs" withBorder>
              {CardEditor}
            </Paper>
          </Stack>
        </div>
      </div>
      <NewNotesFooter setRequestedFinish={setRequestedFinish} deck={deck} />
    </div>
  );
}

export default NewNotesView;

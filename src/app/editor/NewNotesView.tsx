import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ActionIcon,
  Group,
  Kbd,
  Paper,
  Select,
  Space,
  Stack,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconChevronLeft,
} from "@tabler/icons-react";

import MissingObject from "@/components/MissingObject";
import SelectDecksHeader from "@/components/SelectDecksHeader";
import { getAdapterOfType } from "@/logic/NoteTypeAdapter";
import { NoteTypeLabels } from "@/logic/card/card";
import { useDeckFromUrl } from "@/logic/deck/hooks/useDeckFromUrl";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { NoteType } from "@/logic/note/note";
import { useHotkeys, useOs } from "@mantine/hooks";
import { t } from "i18next";
import React from "react";
import { AppHeaderContent } from "../shell/Header/Header";
import NewNotesFooter from "./NewNotesFooter";
import classes from "./NewNotesView.module.css";

function NewNotesView() {
  const navigate = useNavigate();
  const os = useOs();

  const [decks] = useDecks();
  const [deck, isReady] = useDeckFromUrl();
  const [noteType, setNoteType] = useState<NoteType>(NoteType.Basic);
  const [requestedFinish, setRequestedFinish] = useState(false);

  const noteTypeSelectRef = React.createRef<HTMLInputElement>();
  useHotkeys([
    [
      "Mod+J",
      () => {
        noteTypeSelectRef.current?.focus();
        noteTypeSelectRef.current?.click();
      },
    ],
  ]);

  const NoteEditor = useMemo(() => {
    return deck
      ? getAdapterOfType(noteType).editor({
          note: null,
          deck: deck,
          mode: "new",
          requestedFinish,
          setRequestedFinish,
          setNoteType,
          focusSelectNoteType: () => {
            noteTypeSelectRef.current?.focus();
            noteTypeSelectRef.current?.click();
          },
        })
      : null;
  }, [deck, noteType, setNoteType, requestedFinish, setRequestedFinish]);

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
            <Title order={3}>{t("note.new.title")}</Title>
            <ActionIcon
              onClick={() => navigate("/settings/editing")}
              variant="subtle"
              color="gray"
            >
              <IconAdjustmentsHorizontal />
            </ActionIcon>
          </Group>
        </AppHeaderContent>

        <Space h="md" />
        <div className={classes.newNotesEditorContainer}>
          <Stack>
            <Group justify="space-between">
              <Group gap="xs" align="end">
                <SelectDecksHeader
                  label={t("note.new.adding-to-deck", { deckName: deck.name })}
                  decks={decks}
                  disableAll
                  onSelect={(deckId) => navigate(`/new/${deckId}`)}
                />
              </Group>
              <Tooltip
                label={
                  <>
                    {t("note.new.select-note-type.tooltip")}
                    <Kbd>{os === "macos" ? "Cmd" : "Ctrl"} + J</Kbd>
                  </>
                }
              >
                <Select
                  ref={noteTypeSelectRef}
                  value={noteType}
                  onChange={(type) => {
                    setNoteType((type as NoteType) ?? NoteType.Basic);
                  }}
                  label={t("note.new.select-note-type.label")}
                  data={[
                    {
                      label: NoteTypeLabels[NoteType.Basic],
                      value: NoteType.Basic,
                    },
                    {
                      label: NoteTypeLabels[NoteType.DoubleSided],
                      value: NoteType.DoubleSided,
                    },
                    {
                      label:
                        NoteTypeLabels[NoteType.Cloze] +
                        t("global.feature-status.in-development"),
                      value: NoteType.Cloze,
                    },
                    {
                      label:
                        NoteTypeLabels[NoteType.ImageOcclusion] +
                        t("global.feature-status.planned"),
                      value: NoteType.ImageOcclusion,
                    },
                  ]}
                />
              </Tooltip>
            </Group>
            <Paper p="md" shadow="xs" withBorder>
              {NoteEditor}
            </Paper>
          </Stack>
        </div>
      </div>
      <NewNotesFooter setRequestedFinish={setRequestedFinish} deck={deck} />
    </div>
  );
}

export default NewNotesView;

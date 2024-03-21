import { ActionIcon, Group, Kbd, Menu } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconChartBar,
  IconCode,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetting, useShowShortcutHints } from "../../logic/Settings";
import { Card, NoteType } from "../../logic/card";
import { Note, deleteNote, getNote } from "../../logic/note";
import DebugCardModal from "../DebugCardModal/DebugCardModal";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "../custom/Notification/Notification";
import CardStatisticsModal from "../statistics/CardStatisticsModal";

interface CardMenuProps {
  card: Card<NoteType> | undefined;
  onDelete?: Function;
}

function CardMenu({ card, onDelete }: CardMenuProps) {
  const navigate = useNavigate();

  const [developerMode] = useSetting("developerMode");

  const [debugModalOpened, setDebugModalOpened] = useState<boolean>(false);
  const [statisticsModalOpened, setStatisticsModalOpened] =
    useState<boolean>(false);

  const showShortcutHints = useShowShortcutHints();
  useHotkeys([
    ["s", () => setStatisticsModalOpened(true)],
    ["o", () => {}],
    ["shift+d", () => setDebugModalOpened(true)],
    ["e", () => navigate(`/notes/${note?.deck}/${note?.id}`)],
    ["Backspace", () => setDeleteModalOpened(true)],
  ]);

  const [note, setNote] = useState<Note<NoteType> | undefined>();

  const fetchNote = useCallback(async () => {
    if (!card) return;
    setNote(await getNote(card.note));
  }, [card]);

  useEffect(() => {
    fetchNote();
  }, [card]);

  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  async function tryDeleteNote() {
    if (!note) {
      return;
    }
    try {
      await deleteNote(note);
      if (onDelete) {
        onDelete();
      }
      setDeleteModalOpened(false);
      successfullyDeleted("note");
    } catch (error) {
      deleteFailed("note");
      console.log(error);
    }
  }

  if (!card) return null;
  return (
    <>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {note && (
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              rightSection={showShortcutHints && <Kbd>e</Kbd>}
              onClick={() => navigate(`/notes/${note.deck}/${note.id}`)}
            >
              {t("note.menu.edit")}
            </Menu.Item>
          )}
          <Menu.Item
            leftSection={<IconChartBar size={16} />}
            rightSection={showShortcutHints && <Kbd>s</Kbd>}
            onClick={() => setStatisticsModalOpened(true)}
          >
            {t("card.menu.statistics")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconAdjustmentsHorizontal size={16} />}
            rightSection={showShortcutHints && <Kbd>o</Kbd>}
            disabled
          >
            {t("card.menu.options")}
          </Menu.Item>
          {developerMode && (
            <Menu.Item
              leftSection={<IconCode size={16} />}
              rightSection={
                showShortcutHints && (
                  <Group align="center" gap="0.25rem">
                    <Kbd>shift</Kbd>+<Kbd>d</Kbd>
                  </Group>
                )
              }
              onClick={() => setDebugModalOpened(true)}
            >
              {t("card.menu.debug")}
            </Menu.Item>
          )}
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={showShortcutHints && <Kbd>←</Kbd>}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("note.menu.delete")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <CardStatisticsModal
        opened={statisticsModalOpened}
        setOpened={setStatisticsModalOpened}
        card={card}
      />
      <DebugCardModal
        opened={debugModalOpened}
        setOpened={setDebugModalOpened}
        card={card}
      />

      <DangerousConfirmModal
        dangerousAction={() => tryDeleteNote()}
        dangerousDependencies={[note]}
        dangerousTitle={t("note.delete-modal.title")}
        dangerousDescription={t("note.delete-modal.description")}
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
    </>
  );
}

export default CardMenu;

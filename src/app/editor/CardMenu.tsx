import CardStatisticsModal from "@/app/statistics/CardStatisticsModal";
import DangerousConfirmModal from "@/components/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "@/components/Notification/Notification";
import { Group } from "@/components/ui/Group";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import {
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { Card } from "@/logic/card/card";
import { deleteNote } from "@/logic/note/deleteNote";
import { getNote } from "@/logic/note/getNote";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
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
import DebugCardModal from "../DebugCardModal/DebugCardModal";

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
        <MenuTrigger>
          <IconButton variant="subtle">
            <IconDots />
          </IconButton>
        </MenuTrigger>
        <MenuDropdown>
          {note && (
            <MenuItem
              leftSection={<IconEdit size={16} />}
              rightSection={showShortcutHints && <Kbd>e</Kbd>}
              onClick={() => navigate(`/notes/${note.deck}/${note.id}`)}
            >
              {t("note.menu.edit")}
            </MenuItem>
          )}
          <MenuItem
            leftSection={<IconChartBar size={16} />}
            rightSection={showShortcutHints && <Kbd>s</Kbd>}
            onClick={() => setStatisticsModalOpened(true)}
          >
            {t("card.menu.statistics")}
          </MenuItem>
          <MenuItem
            leftSection={<IconAdjustmentsHorizontal size={16} />}
            rightSection={showShortcutHints && <Kbd>o</Kbd>}
            disabled
          >
            {t("card.menu.options")}
          </MenuItem>
          {developerMode && (
            <MenuItem
              leftSection={<IconCode size={16} />}
              rightSection={
                showShortcutHints && (
                  <Group gap="xs" align="center">
                    <Kbd>shift</Kbd>
                    <span>+</span>
                    <Kbd>d</Kbd>
                  </Group>
                )
              }
              onClick={() => setDebugModalOpened(true)}
            >
              {t("card.menu.debug")}
            </MenuItem>
          )}
          <MenuItem
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={showShortcutHints && <Kbd>←</Kbd>}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("note.menu.delete")}
          </MenuItem>
        </MenuDropdown>
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

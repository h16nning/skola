import DangerousConfirmModal from "@/components/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "@/components/Notification/Notification";
import { IconButton } from "@/components/ui/IconButton";
import { Kbd } from "@/components/ui/Kbd";
import { Menu, MenuTrigger, MenuDropdown, MenuItem } from "@/components/ui/Menu";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { deleteNote } from "@/logic/note/deleteNote";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import {
  IconArrowsExchange,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import EditNoteModal from "./EditNoteModal";
import MoveNoteModal from "./MoveNoteModal";

interface NoteMenuProps {
  note: Note<NoteType> | undefined;
  withEdit?: boolean;
  withShortcuts?: boolean;
  onDelete?: Function;
}

function NoteMenu({
  note,
  onDelete,
  withEdit = true,
  withShortcuts = true,
}: NoteMenuProps) {
  const [editModalOpened, editModal] = useDisclosure(false);
  const [moveModalOpened, setMoveModalOpened] = useState<boolean>(false);
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

  const showShortcutHints = useShowShortcutHints();

  useHotkeys(
    withShortcuts
      ? [
          ["e", editModal.open],
          ["Backspace", () => setDeleteModalOpened(true)],
        ]
      : []
  );

  if (!note) return null;

  return (
    <>
      <Menu position="bottom-end">
        <MenuTrigger>
          <IconButton variant="subtle">
            <IconDots />
          </IconButton>
        </MenuTrigger>
        <MenuDropdown>
          {withEdit && (
            <MenuItem
              leftSection={<IconEdit size={16} />}
              rightSection={withShortcuts && showShortcutHints && <Kbd>e</Kbd>}
              onClick={editModal.open}
            >
              {t("note.menu.edit")}
            </MenuItem>
          )}
          <MenuItem
            leftSection={<IconArrowsExchange size={16} />}
            rightSection={withShortcuts && showShortcutHints && <Kbd>m</Kbd>}
            onClick={() => setMoveModalOpened(true)}
          >
            {t("note.menu.move")}
          </MenuItem>
          <MenuItem
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={withShortcuts && showShortcutHints && <Kbd>←</Kbd>}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("note.menu.delete")}
          </MenuItem>
        </MenuDropdown>
      </Menu>
      <DangerousConfirmModal
        dangerousAction={() => tryDeleteNote()}
        dangerousDependencies={[note]}
        dangerousTitle={t("note.delete-modal.title")}
        dangerousDescription={t("note.delete-modal.description")}
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
      <EditNoteModal
        note={note}
        opened={editModalOpened}
        setClose={editModal.close}
      />
      <MoveNoteModal
        note={note}
        opened={moveModalOpened}
        setOpened={setMoveModalOpened}
      />
    </>
  );
}

export default NoteMenu;

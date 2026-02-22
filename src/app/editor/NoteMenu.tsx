import DangerousConfirmModal from "@/components/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "@/components/Notification/Notification";
import { Kbd } from "@/components/ui/Kbd";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { useDisclosure } from "@/lib/hooks/useDisclosure";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { deleteNote } from "@/logic/note/deleteNote";
import { Note, NoteType } from "@/logic/note/note";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import { IconArrowsExchange, IconEdit, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { Suspense, lazy, useState } from "react";

const EditNoteModal = lazy(() => import("./EditNoteModal"));
const MoveNoteModal = lazy(() => import("./MoveNoteModal"));

interface NoteMenuProps extends React.HTMLAttributes<HTMLDivElement> {
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
  ...props
}: NoteMenuProps) {
  const [editModalOpened, editModal] = useDisclosure(false);
  const [moveModalOpened, setMoveModalOpened] = useState<boolean>(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  const [hasOpenedEdit, setHasOpenedEdit] = useState(false);
  const [hasOpenedMove, setHasOpenedMove] = useState(false);

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
          [
            "e",
            () => {
              setHasOpenedEdit(true);
              editModal.open();
            },
          ],
          ["Backspace", () => setDeleteModalOpened(true)],
        ]
      : []
  );

  if (!note) return null;

  return (
    <>
      <Menu {...props}>
        {withEdit && (
          <MenuItem
            leftSection={<IconEdit size={16} />}
            rightSection={withShortcuts && showShortcutHints && <Kbd>e</Kbd>}
            onClick={() => {
              setHasOpenedEdit(true);
              editModal.open();
            }}
          >
            {t("note.menu.edit")}
          </MenuItem>
        )}
        <MenuItem
          leftSection={<IconArrowsExchange size={16} />}
          rightSection={withShortcuts && showShortcutHints && <Kbd>m</Kbd>}
          onClick={() => {
            setHasOpenedMove(true);
            setMoveModalOpened(true);
          }}
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
      </Menu>
      <DangerousConfirmModal
        dangerousAction={() => tryDeleteNote()}
        dangerousDependencies={[note]}
        dangerousTitle={t("note.delete-modal.title")}
        dangerousDescription={t("note.delete-modal.description")}
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
      {hasOpenedEdit && (
        <Suspense fallback={null}>
          <EditNoteModal
            note={note}
            opened={editModalOpened}
            setClose={editModal.close}
          />
        </Suspense>
      )}
      {hasOpenedMove && (
        <Suspense fallback={null}>
          <MoveNoteModal
            note={note}
            opened={moveModalOpened}
            setOpened={setMoveModalOpened}
          />
        </Suspense>
      )}
    </>
  );
}

export default NoteMenu;

import ImportModal from "@/app/settings/importexport/ImportModal";
import DangerousConfirmModal from "@/components/DangerousConfirmModal";
import {
  IconButton,
  Kbd,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTrigger,
} from "@/components/ui";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { Deck } from "@/logic/deck/deck";
import { deleteDeck } from "@/logic/deck/deleteDeck";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconCards,
  IconCode,
  IconCursorText,
  IconDots,
  IconFileImport,
  IconTrash,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DebugDeckModal from "./DebugDeckModal";
import MoveDeckModal from "./MoveDeckModal";
import RenameDeckModal from "./RenameDeckModal";

interface DeckMenuProps {
  deck?: Deck;
  isDeckReady: boolean;
  setDeckOptionsOpened: Function;
}

function DeckMenu({ deck, isDeckReady, setDeckOptionsOpened }: DeckMenuProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const [developerMode] = useSetting("developerMode");

  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [moveModalOpened, setMoveModalOpened] = useState<boolean>(false);
  const [renameModalOpened, setRenameModalOpened] = useState<boolean>(false);
  const [importModalOpened, setImportModalOpened] = useState<boolean>(false);
  const [debugModalOpened, setDebugModalOpened] = useState<boolean>(false);

  const handleDelete = useCallback(async () => {
    if (!deck) {
      return;
    }
    try {
      await deleteDeck(deck);
      setDeleteModalOpened(false);
      navigate(
        deck.superDecks && deck.superDecks[deck.superDecks.length - 1]
          ? "/deck/" + deck.superDecks[deck.superDecks.length - 1]
          : "/home"
      );
    } catch (error) {
      console.error("Failed to delete deck: " + error);
    }
  }, [deck, navigate]);

  const manageCards = useCallback(() => {
    if (deck) {
      navigate("/notes/" + deck.id);
    }
  }, [deck, navigate]);

  const showShortcutHints = useShowShortcutHints();
  useHotkeys([
    ["r", () => setRenameModalOpened(true)],
    ["m", () => {}],
    ["b", manageCards],
    ["i", () => setImportModalOpened(true)],
    ["o", () => setDeckOptionsOpened(true)],
    ["shift+d", () => setDebugModalOpened(true)],
    ["Backspace", () => setDeleteModalOpened(true)],
  ]);

  return (
    <>
      <Menu position="bottom-end">
        <MenuTrigger>
          <IconButton
            variant="subtle"
            aria-label={t("deck.menu.label")}
            disabled={isDeckReady && !deck}
          >
            <IconDots />
          </IconButton>
        </MenuTrigger>
        <MenuDropdown>
          <MenuItem
            leftSection={<IconCursorText size={16} />}
            rightSection={showShortcutHints && <Kbd>r</Kbd>}
            onClick={() => setRenameModalOpened(true)}
          >
            {t("deck.menu.rename")}
          </MenuItem>
          <MenuItem
            leftSection={<IconArrowsExchange size={16} />}
            rightSection={showShortcutHints && <Kbd>m</Kbd>}
            onClick={() => setMoveModalOpened(true)}
          >
            {t("deck.menu.move")}
          </MenuItem>
          <MenuItem
            leftSection={<IconCards size={16} />}
            rightSection={showShortcutHints && <Kbd>b</Kbd>}
            onClick={manageCards}
          >
            {t("deck.menu.manage-cards")}
          </MenuItem>
          <MenuItem
            leftSection={<IconFileImport size={16} />}
            rightSection={showShortcutHints && <Kbd>i</Kbd>}
            onClick={() => setImportModalOpened(true)}
          >
            {t("deck.menu.import-cards")}
          </MenuItem>
          <MenuItem
            leftSection={<IconAdjustmentsHorizontal size={16} />}
            rightSection={showShortcutHints && <Kbd>o</Kbd>}
            onClick={() => setDeckOptionsOpened(true)}
          >
            {t("deck.menu.options")}
          </MenuItem>
          {developerMode ? (
            <MenuItem
              leftSection={<IconCode size={16} />}
              rightSection={
                showShortcutHints && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Kbd>&#8679; d</Kbd>
                  </span>
                )
              }
              onClick={() => setDebugModalOpened(true)}
            >
              {t("deck.menu.debug")}
            </MenuItem>
          ) : null}
          <MenuItem
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={showShortcutHints && <Kbd>←</Kbd>}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("deck.menu.delete")}
          </MenuItem>
        </MenuDropdown>
      </Menu>
      {deck && (
        <>
          <DangerousConfirmModal
            dangerousAction={() => handleDelete()}
            dangerousDependencies={[deck]}
            dangerousTitle={"Delete Deck"}
            dangerousDescription={
              "You are about to delete this deck. This cannot be undone. Do you wish to continue?"
            }
            opened={deleteModalOpened}
            setOpened={setDeleteModalOpened}
          />
          <RenameDeckModal
            deck={deck}
            opened={renameModalOpened}
            setOpened={setRenameModalOpened}
          />
          <MoveDeckModal
            deck={deck}
            opened={moveModalOpened}
            setOpened={setMoveModalOpened}
          />
          <DebugDeckModal
            deck={deck}
            opened={debugModalOpened}
            setOpened={setDebugModalOpened}
          />
          <ImportModal
            deck={deck}
            opened={importModalOpened}
            setOpened={setImportModalOpened}
          />
        </>
      )}
    </>
  );
}

export default DeckMenu;

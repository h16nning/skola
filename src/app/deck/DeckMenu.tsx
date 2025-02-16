import ImportModal from "@/app/settings/importexport/ImportModal";
import DangerousConfirmModal from "@/components/DangerousConfirmModal";
import { Deck } from "@/logic/deck/deck";
import { deleteDeck } from "@/logic/deck/deleteDeck";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import { ActionIcon, Group, Kbd, Menu } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
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
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label={t("deck.menu.label")}
            disabled={isDeckReady && !deck}
          >
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconCursorText size={16} />}
            rightSection={showShortcutHints && <Kbd>r</Kbd>}
            onClick={() => setRenameModalOpened(true)}
          >
            {t("deck.menu.rename")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconArrowsExchange size={16} />}
            rightSection={showShortcutHints && <Kbd>m</Kbd>}
            onClick={() => setMoveModalOpened(true)}
          >
            {t("deck.menu.move")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCards size={16} />}
            rightSection={showShortcutHints && <Kbd>b</Kbd>}
            onClick={manageCards}
          >
            {t("deck.menu.manage-cards")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconFileImport size={16} />}
            rightSection={showShortcutHints && <Kbd>i</Kbd>}
            onClick={() => setImportModalOpened(true)}
          >
            {t("deck.menu.import-cards")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconAdjustmentsHorizontal size={16} />}
            rightSection={showShortcutHints && <Kbd>o</Kbd>}
            onClick={() => setDeckOptionsOpened(true)}
          >
            {t("deck.menu.options")}
          </Menu.Item>
          {developerMode ? (
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
              {t("deck.menu.debug")}
            </Menu.Item>
          ) : null}
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={showShortcutHints && <Kbd>←</Kbd>}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("deck.menu.delete")}
          </Menu.Item>
        </Menu.Dropdown>
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

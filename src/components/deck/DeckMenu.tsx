import React, { useCallback, useState } from "react";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconCards,
  IconCode,
  IconCursorText,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";
import { Deck, deleteDeck } from "../../logic/deck";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import { useNavigate } from "react-router-dom";
import RenameModal from "../editcard/RenameModal";
import DebugDeckModal from "./DebugDeckModal";
import { Card, CardsStats, CardType } from "../../logic/card";

interface DeckMenuProps {
  deck?: Deck;
  cards: Card<CardType>[];
  stats: CardsStats;
  setDeckOptionsOpened: Function;
}

function DeckMenu({ deck, setDeckOptionsOpened, cards, stats }: DeckMenuProps) {
  const navigate = useNavigate();
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  const [renameModalOpened, setRenameModalOpened] = useState<boolean>(false);
  const [debugModalOpened, setDebugModalOpened] = useState<boolean>(false);

  const tryDeleteDeck = useCallback(async () => {
    if (!deck) {
      return;
    }
    try {
      await deleteDeck(deck);
      setDeleteModalOpened(false);
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete deck: " + error);
    }
  }, [deck, navigate]);

  return (
    <>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon>
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconCode size={16} />}
            onClick={() => setDebugModalOpened(true)}
          >
            Debug
          </Menu.Item>
          <Menu.Item
            icon={<IconCards size={16} />}
            onClick={() => navigate("/cards/" + deck?.id)}
          >
            Manage Cards
          </Menu.Item>
          <Menu.Item
            onClick={() => setDeckOptionsOpened(true)}
            icon={<IconAdjustmentsHorizontal size={16} />}
          >
            Options
          </Menu.Item>
          <Menu.Item icon={<IconArrowsExchange size={16} />}>
            Move Deck
          </Menu.Item>
          <Menu.Item
            icon={<IconCursorText size={16} />}
            onClick={() => setRenameModalOpened(true)}
          >
            Rename
          </Menu.Item>
          <Menu.Item
            color="red"
            icon={<IconTrash size={16} />}
            onClick={() => setDeleteModalOpened(true)}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <DangerousConfirmModal
        dangerousAction={() => tryDeleteDeck()}
        dangerousDependencies={[deck]}
        dangerousTitle={"Delete Deck"}
        dangerousDescription={
          "You are about to delete this deck. This cannot be undone. Do you wish to continue?"
        }
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
      <RenameModal
        deck={deck}
        opened={renameModalOpened}
        setOpened={setRenameModalOpened}
      />
      <DebugDeckModal
        deck={deck}
        cards={cards}
        stats={stats}
        opened={debugModalOpened}
        setOpened={setDebugModalOpened}
      />
    </>
  );
}

export default DeckMenu;

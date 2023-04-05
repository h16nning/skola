import React, { useState } from "react";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconCode,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import { Card, CardType, deleteCard } from "../../logic/card";
import DebugCardModal from "../DebugCardModal";
import { useSetting } from "../../logic/Settings";
import { notifications } from "@mantine/notifications";
import { deleteFailed, successfullyDeleted } from "../custom/Notification";

interface CardMenuProps {
  card: Card<CardType> | undefined;
  onDelete?: Function;
}

function CardMenu({ card, onDelete }: CardMenuProps) {
  const [developerMode] = useSetting("developerMode");

  const [debugModalOpened, setDebugModalOpened] = useState<boolean>(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  async function tryDeleteCard() {
    if (!card) {
      return;
    }
    try {
      await deleteCard(card);
      if (onDelete) {
        onDelete();
      }
      setDeleteModalOpened(false);
      successfullyDeleted("card");
    } catch (error) {
      deleteFailed("card");
      console.log(error);
    }
  }

  return (
    <>
      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon>
            <IconDots />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {developerMode ? (
            <Menu.Item
              icon={<IconCode size={16} />}
              onClick={() => setDebugModalOpened(true)}
            >
              Debug
            </Menu.Item>
          ) : null}
          <Menu.Item icon={<IconAdjustmentsHorizontal size={16} />}>
            Options
          </Menu.Item>
          <Menu.Item icon={<IconArrowsExchange size={16} />}>
            Move Card
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
      <DebugCardModal
        opened={debugModalOpened}
        setOpened={setDebugModalOpened}
        card={card}
      />

      <DangerousConfirmModal
        dangerousAction={(card: Card<CardType>) => tryDeleteCard()}
        dangerousDependencies={[card]}
        dangerousTitle={"Delete Card"}
        dangerousDescription={
          "You are about to delete this card. This cannot be undone. Do you wish to continue?"
        }
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
    </>
  );
}

export default CardMenu;

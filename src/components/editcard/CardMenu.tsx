import React, { useState } from "react";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconCode,
  IconDots,
  IconTrash,
} from "@tabler/icons-react";
import DangerousConfirmModal from "../DangerousConfirmModal";
import { useNavigate } from "react-router-dom";
import { Card, CardType, deleteCard } from "../../logic/card";

interface CardMenuProps {
  card?: Card<CardType>;
}

function CardMenu({ card }: CardMenuProps) {
  const navigate = useNavigate();
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);

  async function tryDeleteCard() {
    if (!card) {
      return;
    }
    try {
      await deleteCard(card);
      setDeleteModalOpened(false);
    } catch (error) {
      console.error("Failed to delete card: " + error);
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
          <Menu.Item icon={<IconCode size={16} />}>Debug</Menu.Item>
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

import { ActionIcon, Menu } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconChartBar,
  IconCode,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUtils } from "../../logic/CardTypeManager";
import { useSetting } from "../../logic/Settings";
import { Card, CardType } from "../../logic/card";
import DebugCardModal from "../DebugCardModal/DebugCardModal";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "../custom/Notification/Notification";
import CardStatisticsModal from "../statistics/CardStatisticsModal";
import MoveCardModal from "./MoveCardModal";
import { t } from "i18next";

interface CardMenuProps {
  card: Card<CardType> | undefined;
  withEdit?: boolean;
  onDelete?: Function;
}

function CardMenu({ card, onDelete, withEdit = true }: CardMenuProps) {
  const [developerMode] = useSetting("developerMode");
  const navigate = useNavigate();

  const [debugModalOpened, setDebugModalOpened] = useState<boolean>(false);
  const [statisticsModalOpened, setStatisticsModalOpened] =
    useState<boolean>(false);

  const [moveModalOpened, setMoveModalOpened] = useState<boolean>(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState<boolean>(false);
  async function tryDeleteCard() {
    if (!card) {
      return;
    }
    try {
      await getUtils(card).delete(card);
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
          {withEdit && (
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => navigate(`/cards/${card.deck}/${card.id}`)}
            >
              {t("card.menu.edit")}
            </Menu.Item>
          )}
          <Menu.Item
            leftSection={<IconArrowsExchange size={16} />}
            onClick={() => setMoveModalOpened(true)}
          >
            {t("card.menu.move")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconChartBar size={16} />}
            onClick={() => setStatisticsModalOpened(true)}
          >
            {t("card.menu.statistics")}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconAdjustmentsHorizontal size={16} />}
            disabled
          >
            {t("card.menu.options")}
          </Menu.Item>
          {developerMode ? (
            <Menu.Item
              leftSection={<IconCode size={16} />}
              onClick={() => setDebugModalOpened(true)}
            >
              {t("card.menu.debug")}
            </Menu.Item>
          ) : null}
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => setDeleteModalOpened(true)}
          >
            {t("card.menu.delete")}
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
      {card && (
        <MoveCardModal
          card={card}
          opened={moveModalOpened}
          setOpened={setMoveModalOpened}
        />
      )}

      <DangerousConfirmModal
        dangerousAction={() => tryDeleteCard()}
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

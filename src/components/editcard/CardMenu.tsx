import { ActionIcon, Group, Kbd, Menu } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsExchange,
  IconChartBar,
  IconCode,
  IconDots,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUtils } from "../../logic/TypeManager";
import { useSetting, useShowShortcutHints } from "../../logic/Settings";
import { Card, CardType } from "../../logic/card";
import DebugCardModal from "../DebugCardModal/DebugCardModal";
import DangerousConfirmModal from "../custom/DangerousConfirmModal";
import {
  deleteFailed,
  successfullyDeleted,
} from "../custom/Notification/Notification";
import CardStatisticsModal from "../statistics/CardStatisticsModal";
import MoveCardModal from "./MoveCardModal";
import { useHotkeys } from "@mantine/hooks";

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
      await getUtils(card).deleteCard(card);
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
  const showShortcutHints = useShowShortcutHints();
  useHotkeys([
    ["e", () => navigate(`/cards/${card?.deck}/${card?.id}`)],
    ["m", () => setMoveModalOpened(true)],
    ["s", () => setStatisticsModalOpened(true)],
    ["o", () => {}],
    ["shift+d", () => setDebugModalOpened(true)],
    ["Backspace", () => setDeleteModalOpened(true)],
  ]);

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
              rightSection={showShortcutHints && <Kbd>e</Kbd>}
              onClick={() => navigate(`/cards/${card.deck}/${card.id}`)}
            >
              {t("card.menu.edit")}
            </Menu.Item>
          )}
          <Menu.Item
            leftSection={<IconArrowsExchange size={16} />}
            rightSection={showShortcutHints && <Kbd>m</Kbd>}
            onClick={() => setMoveModalOpened(true)}
          >
            {t("card.menu.move")}
          </Menu.Item>
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
              {t("card.menu.debug")}
            </Menu.Item>
          ) : null}
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            rightSection={showShortcutHints && <Kbd>←</Kbd>}
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
        dangerousTitle={t("card.delete-modal.title")}
        dangerousDescription={t("card.delete-modal.description")}
        opened={deleteModalOpened}
        setOpened={setDeleteModalOpened}
      />
    </>
  );
}

export default CardMenu;

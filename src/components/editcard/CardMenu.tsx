import { ActionIcon, Group, Kbd, Menu } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconAdjustmentsHorizontal,
  IconChartBar,
  IconCode,
  IconDots,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useSetting, useShowShortcutHints } from "../../logic/Settings";
import { Card, CardType } from "../../logic/card";
import { Note, getNote } from "../../logic/note";
import DebugCardModal from "../DebugCardModal/DebugCardModal";
import CardStatisticsModal from "../statistics/CardStatisticsModal";
import NoteMenu from "./NoteMenu";

interface CardMenuProps {
  card: Card<CardType> | undefined;
  withEdit?: boolean;
  onDelete?: Function;
}

function CardMenu({ card, onDelete, withEdit = true }: CardMenuProps) {
  const [developerMode] = useSetting("developerMode");

  const [debugModalOpened, setDebugModalOpened] = useState<boolean>(false);
  const [statisticsModalOpened, setStatisticsModalOpened] =
    useState<boolean>(false);

  const showShortcutHints = useShowShortcutHints();
  useHotkeys([
    ["s", () => setStatisticsModalOpened(true)],
    ["o", () => {}],
    ["shift+d", () => setDebugModalOpened(true)],
  ]);

  const [note, setNote] = useState<Note<CardType> | undefined>();

  const fetchNote = useCallback(async () => {
    if (!card) return;
    setNote(await getNote(card.note));
  }, [card]);

  useEffect(() => {
    fetchNote();
  }, [card]);

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
          {developerMode && (
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
          )}
          {
            <NoteMenu
              note={note}
              withEdit={withEdit}
              withShortcuts={false}
              onDelete={onDelete}
            />
          }
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
    </>
  );
}

export default CardMenu;

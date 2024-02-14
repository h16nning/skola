import classes from "./Sidebar.module.css";
import cx from "clsx";
import React, { useState } from "react";
import {
  ActionIcon,
  Group,
  NavLink,
  Stack,
  Title,
  Tooltip,
  Image,
  useMantineTheme,
  Box,
  Text,
} from "@mantine/core";
import {
  IconBolt,
  IconCards,
  IconChartBar,
  IconHome,
  IconPlus,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { t } from "i18next";
import DeckTree from "./DeckTree";
import { useTopLevelDecks } from "../../logic/deck";
import NewDeckModal from "../deck/NewDeckModal";

const InteractiveNavLink = ({
  label,
  path,
  icon,
  minimalMode,
  fullscreenMode,
  closeMenu,
}: {
  label: string;
  path: string;
  icon: JSX.Element;
  minimalMode: boolean;
  fullscreenMode: boolean;
  closeMenu: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Tooltip
      label={label}
      disabled={!minimalMode || fullscreenMode}
      position="right"
      keepMounted={false}
    >
      <NavLink
        classNames={{
          root: classes.sidebarItem,
          body: classes.sidebarItemBody,
          label: classes.sidebarItemLabel,
          section: classes.sidebarItemIcon,
        }}
        variant="subtle"
        label={label}
        leftSection={icon}
        onClick={() => {
          navigate(path);
          fullscreenMode && closeMenu();
        }}
        active={location.pathname.startsWith(path)}
      />
    </Tooltip>
  );
};

function Sidebar({
  menuOpened,
  menuHandlers,
}: {
  menuOpened: boolean;
  menuHandlers: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
}) {
  const [newDeckModalOpened, setNewDeckModalOpened] = useState(false);
  const theme = useMantineTheme();

  const fullscreenMode = !!useMediaQuery(
    "(max-width: " + theme.breakpoints.xs + ")"
  );
  const isXsLayout = useMediaQuery("(min-width: " + theme.breakpoints.sm + ")");
  const minimalMode = !!useMediaQuery(
    "(max-width: " +
      theme.breakpoints.lg +
      ") and (min-width: " +
      theme.breakpoints.xs +
      ")"
  );

  const landscapeMode = useMediaQuery("(orientation: landscape)");
  const [decks, isReady] = useTopLevelDecks();

  return (
    <Box
      p="0.5rem"
      className={cx(
        classes.sidebar,
        minimalMode && classes.minimalMode,
        landscapeMode && classes.landscapeMode,
        fullscreenMode && classes.fullscreenMode,
        fullscreenMode && menuOpened && classes.fullscreenModeOpened
      )}
    >
      <Stack gap="xs">
        <Group className={classes.topRow}>
          <Group gap="xs" align="center">
            <Image src="/logo.svg" alt="Skola Logo" maw="1.5rem" />
            <Title order={5}>Skola</Title>
          </Group>
          {fullscreenMode ? (
            <ActionIcon
              onClick={menuHandlers.close}
              style={{ alignSelf: "end" }}
              variant="subtle"
            >
              <IconX />
            </ActionIcon>
          ) : null}
        </Group>
        <InteractiveNavLink
          label={t("home.title")}
          path="/home"
          icon={<IconHome />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
        <InteractiveNavLink
          label={t("today.title")}
          path="/today"
          icon={<IconBolt />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
        <InteractiveNavLink
          label={t("statistics.title")}
          path="/stats"
          icon={<IconChartBar />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />

        <InteractiveNavLink
          label={t("manage-cards.title")}
          path="/cards"
          icon={<IconCards />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
        <InteractiveNavLink
          label={t("settings.title")}
          path="/settings"
          icon={<IconSettings />}
          minimalMode={minimalMode}
          fullscreenMode={fullscreenMode}
          closeMenu={menuHandlers.close}
        />
      </Stack>
      {isXsLayout && !minimalMode && (
        <>
          <Text c="dimmed" p="xs" pt="md" fz="sm">
            {t("sidebar.decks-title")}
          </Text>
          {isReady &&
            decks?.map((deck) => <DeckTree deck={deck} key={deck.id} />)}
          <NavLink
            label={
              <Text c="dimmed" fz="xs">
                {t("sidebar.decks-add")}
              </Text>
            }
            onClick={() => setNewDeckModalOpened(true)}
            leftSection={<IconPlus size={"1rem"} color={"gray"} />}
          />
          <NewDeckModal
            opened={newDeckModalOpened}
            setOpened={setNewDeckModalOpened}
          />
        </>
      )}
    </Box>
  );
}

export default Sidebar;

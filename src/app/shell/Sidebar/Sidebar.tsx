import {
  ActionIcon,
  Box,
  Group,
  Image,
  NavLink,
  Stack,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBolt,
  IconCards,
  IconChartBar,
  IconHome,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import cx from "clsx";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Sidebar.module.css";

import SpotlightCard from "../Spotlight/Spotlight";
import CloudSection from "./CloudSection";
import DeckList from "./DeckList";

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
  const location = useLocation();

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
        variant="filled"
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
  const theme = useMantineTheme();

  const fullscreenMode = !!useMediaQuery(
    "(max-width: " + theme.breakpoints.xs + ")"
  );
  const minimalMode = !!useMediaQuery(
    "(max-width: " +
      theme.breakpoints.lg +
      ") and (min-width: " +
      theme.breakpoints.xs +
      ")"
  );

  const landscapeMode = useMediaQuery("(orientation: landscape)");

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
      <Stack justify="space-between" h="100%">
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
          <SpotlightCard minimalMode={minimalMode} />

          <Stack gap={0}>
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
              path="/notes"
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
          <DeckList minimalMode={minimalMode} />
        </Stack>
        <CloudSection minimalMode={minimalMode} />
      </Stack>
    </Box>
  );
}

export default Sidebar;

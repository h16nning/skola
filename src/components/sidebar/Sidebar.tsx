import classes from "./Sidebar.module.css";
import cx from "clsx";
import React, { useCallback } from "react";
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
} from "@mantine/core";
import {
  IconBolt,
  IconCards,
  IconChartBar,
  IconChevronRight,
  IconHome,
  IconSettings,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

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
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const fullscreenMode = useMediaQuery(
    "(max-width: " + theme.breakpoints.xs + ")"
  );
  const minimalMode = useMediaQuery(
    "(max-width: " +
      theme.breakpoints.lg +
      ") and (min-width: " +
      theme.breakpoints.xs +
      ")"
  );

  const landscapeMode = useMediaQuery("(orientation: landscape)");

  const InteractiveNavLink = useCallback(
    ({
      label,
      path,
      icon,
    }: {
      label: string;
      path: string;
      icon: JSX.Element;
    }) => {
      return (
        <Tooltip
          label={label}
          disabled={!minimalMode || !fullscreenMode}
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
              fullscreenMode && menuHandlers.close();
            }}
            active={location.pathname.startsWith(path)}
          />
        </Tooltip>
      );
    },
    [location.pathname, navigate, menuHandlers, fullscreenMode]
  );

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
              onClick={() => menuHandlers.close()}
              style={{ alignSelf: "end" }}
            >
              <IconChevronRight />
            </ActionIcon>
          ) : null}
        </Group>
        <InteractiveNavLink label="Home" path="/home" icon={<IconHome />} />
        <InteractiveNavLink label="Today" path="/today" icon={<IconBolt />} />
        <InteractiveNavLink
          label="Statistics"
          path="/stats"
          icon={<IconChartBar />}
        />

        <InteractiveNavLink
          label="Manage Cards"
          path="/cards"
          icon={<IconCards />}
        />
        <InteractiveNavLink
          label="Settings"
          path="/settings"
          icon={<IconSettings />}
        />
      </Stack>
    </Box>
  );
}

export default Sidebar;

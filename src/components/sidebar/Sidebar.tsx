import React, { useCallback } from "react";
import {
  ActionIcon,
  Group,
  MediaQuery,
  Navbar,
  NavLink,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBolt,
  IconCards,
  IconChartBar,
  IconHome,
  IconMenu2,
  IconSettings,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

function Sidebar({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: Function;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const usesFullScreen = useMediaQuery(
    "(max-width: " + theme.breakpoints.sm + ")"
  );

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
        <Tooltip label={label} position="right">
          <NavLink
            label={label}
            icon={icon}
            onClick={() => {
              navigate(path);
              usesFullScreen && setOpened(false);
            }}
            active={location.pathname.startsWith(path)}
          />
        </Tooltip>
      );
    },
    [location.pathname, navigate, setOpened, usesFullScreen]
  );

  const onlyIcons = {
    display: "inline-block",
    padding: theme.spacing.xs,
    "& .app-name": { display: "none" },
    "& .mantine-NavLink-root": {
      gap: "0",
      padding: "0.5rem",
      width: "2.5rem",
      justifyContent: "center",
    },
    "& .mantine-NavLink-icon": { marginRight: "0" },
    "& .mantine-NavLink-body": { display: "none" },
    "& .mantine-Tooltip-tooltip": { display: "initial !important" },
  };

  const fullScreen = {};

  return (
    <MediaQuery smallerThan="md" largerThan="sm" styles={onlyIcons}>
      <MediaQuery smallerThan="sm" styles={fullScreen}>
        <Navbar
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: "3.825rem", md: 300 }}
          p="md"
          sx={{
            "& .mantine-Tooltip-tooltip": { display: "none" },
          }}
        >
          <Navbar.Section>
            <Stack spacing="xs">
              {opened && usesFullScreen ? (
                <ActionIcon onClick={() => setOpened(false)}>
                  <IconMenu2 />
                </ActionIcon>
              ) : null}
              <InteractiveNavLink
                label="Home"
                path="/home"
                icon={<IconHome />}
              />
              <InteractiveNavLink
                label="Today"
                path="/today"
                icon={<IconBolt />}
              />
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
          </Navbar.Section>
        </Navbar>
      </MediaQuery>
    </MediaQuery>
  );
}

export default Sidebar;

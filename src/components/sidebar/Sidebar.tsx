import React, { useCallback } from "react";
import {
  ActionIcon,
  Group,
  MediaQuery,
  Navbar,
  NavLink,
  Stack,
  Title,
  Tooltip,
  Image,
  useMantineTheme,
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
  setMenuOpened,
}: {
  menuOpened: boolean;
  setMenuOpened: Function;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const usesFullScreen = useMediaQuery(
    "(max-width: " + theme.breakpoints.sm + ")"
  );
  const usesOnlyIcons = useMediaQuery(
    "(max-width: " +
      theme.breakpoints.md +
      ") and (min-width: " +
      theme.breakpoints.sm +
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
        <Tooltip label={label} position="right">
          <NavLink
            label={label}
            icon={icon}
            onClick={() => {
              navigate(path);
              usesFullScreen && setMenuOpened(false);
            }}
            active={location.pathname.startsWith(path)}
          />
        </Tooltip>
      );
    },
    [location.pathname, navigate, setMenuOpened, usesFullScreen]
  );

  const onlyIcons = {
    display: "inline-block",
    padding: theme.spacing.md + " " + theme.spacing.xs,
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

  const fullScreen = {
    transform: menuOpened
      ? "none"
      : `translateX(-100${landscapeMode ? "vw" : "vh"})`,
    visible: menuOpened ? "visible" : "hidden",
    boxShadow: theme.shadows.xl,
    transition: "transform 200ms ease-in-out",
  };

  return (
    <MediaQuery smallerThan="md" largerThan="sm" styles={onlyIcons}>
      <MediaQuery smallerThan="sm" styles={fullScreen}>
        <Navbar
          hiddenBreakpoint="sm"
          width={{ sm: "3.825rem", md: "15rem" }}
          p="0.5rem"
          sx={{
            "& .mantine-Tooltip-tooltip": { display: "none" },
          }}
        >
          <Navbar.Section>
            <Stack spacing="xs">
              <Group
                position="apart"
                align="center"
                py="0.5rem"
                h="3.25rem"
                pl="xs"
                display={!usesOnlyIcons ? "flex" : "none"}
              >
                <Group spacing="xs" align="center">
                  <Image src="/logo.svg" alt="Skola Logo" maw="1.5rem" />
                  <Title order={5}>Skola</Title>
                </Group>
                {usesFullScreen ? (
                  <ActionIcon
                    onClick={() => setMenuOpened(false)}
                    sx={() => ({ alignSelf: "end" })}
                  >
                    <IconChevronRight />
                  </ActionIcon>
                ) : null}
              </Group>
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

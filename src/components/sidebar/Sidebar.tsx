import React from "react";
import {
  Box,
  Button,
  Card,
  Navbar,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBolt,
  IconCards,
  IconChartBar,
  IconHome,
  IconHomeStats,
  IconSettings,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Navbar width={{ base: 320 }} p="md" hiddenBreakpoint="sm" hidden={true}>
      <Navbar.Section mb="lg">
        <Text fw="400" fz="sm">
          Super Anki
        </Text>
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing="xs">
          <NavLink
            label="Home"
            icon={<IconHome />}
            onClick={() => navigate("/home")}
            active={location.pathname.endsWith("/home")}
          />
          <NavLink label="Today" icon={<IconBolt />} />
          <NavLink label="Statistics" icon={<IconChartBar />} />
          <NavLink
            label="Manage Cards"
            icon={<IconCards />}
            onClick={() => navigate("/cards")}
            active={location.pathname.startsWith("/cards")}
          />
          <NavLink
            label="Settings"
            icon={<IconSettings />}
            onClick={() => navigate("/settings")}
            active={location.pathname.startsWith("/settings")}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;

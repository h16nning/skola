import React from "react";
import { ActionIcon, Group } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";

interface HeaderProps {
  sidebarOpened: boolean;
  setSidebarOpened: Function;
}

export default function Header({
  sidebarOpened,
  setSidebarOpened,
}: HeaderProps) {
  return (
    <Group
      sx={(theme) => ({
        padding: theme.spacing.xs + " " + theme.spacing.md,
        position: "sticky",
        width: "100%",
        left: "0px",
        right: "0px",
        zIndex: 2,
        backgroundColor:
          theme.colorScheme === "light" ? theme.white : theme.colors.dark[7],
        boxShadow: theme.shadows.xs,
      })}
    >
      <ActionIcon onClick={() => setSidebarOpened(!sidebarOpened)}>
        <IconMenu2 />
      </ActionIcon>
    </Group>
  );
}

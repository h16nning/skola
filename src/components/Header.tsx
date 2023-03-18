import React from "react";
import { ActionIcon, Group } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { swapMono } from "../logic/ui";

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
        padding: theme.spacing.md,
        position: "sticky",
        width: "100%",
        left: "0px",
        right: "0px",
        zIndex: 2,
        backgroundColor:
          theme.colorScheme === "light" ? theme.white : theme.colors.dark[7],
        borderBottom: "solid 1px " + swapMono(theme, 3, 5),
      })}
    >
      <ActionIcon onClick={() => setSidebarOpened(!sidebarOpened)}>
        <IconMenu2 />
      </ActionIcon>
    </Group>
  );
}

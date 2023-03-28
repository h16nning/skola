import React from "react";
import { ActionIcon } from "@mantine/core";
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
    <ActionIcon
      sx={(theme) => ({
        boxShadow: theme.shadows.lg,
        position: "relative",
        top: theme.spacing.md,
        left: theme.spacing.md,
        zIndex: 2,
      })}
      onClick={() => setSidebarOpened(!sidebarOpened)}
    >
      <IconMenu2 />
    </ActionIcon>
  );
}

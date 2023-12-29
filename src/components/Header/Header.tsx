import classes from "./Header.module.css";
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
      className={classes.icon}
      onClick={() => setSidebarOpened(!sidebarOpened)}
    >
      <IconMenu2 />
    </ActionIcon>
  );
}

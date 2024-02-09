import classes from "./Header.module.css";
import React, { PropsWithChildren } from "react";
import { ActionIcon, AppShell, Burger, Group, Title } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { createPortal } from "react-dom";

interface HeaderProps {
  menuOpened: boolean;
  menuHandlers: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
}

export const APP_HEADER_OUTLET_NAME = "APP_HEADER_OUTLET";

export const AppHeaderOutlet = () => (
  <div id={APP_HEADER_OUTLET_NAME} style={{ flexGrow: 2 }} />
);

export const AppHeaderContent = ({ children }: PropsWithChildren) => {
  const element = document.getElementById(
    APP_HEADER_OUTLET_NAME
  ) as HTMLElement;
  return element && createPortal(children, element);
};

export default function Header({ menuOpened, menuHandlers }: HeaderProps) {
  console.log("Header");
  return (
    <AppShell.Header withBorder={false}>
      <Group h="100%" px="md" p="lg" justify="flex-start">
        <Burger
          opened={menuOpened}
          onClick={menuHandlers.toggle}
          hiddenFrom="sm"
          size="sm"
        />
        <AppHeaderOutlet />
      </Group>
    </AppShell.Header>
  );
}

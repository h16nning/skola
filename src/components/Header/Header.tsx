import { AppShell, Burger, Group } from "@mantine/core";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import classes from "./Header.module.css";
import { useWindowScroll } from "@mantine/hooks";

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
  const [scroll] = useWindowScroll();
  return (
    <AppShell.Header
      withBorder={false}
      className={classes.header + " " + (scroll.y > 5 && classes.scrolled)}
    >
      <Group h="100%" pl="md" pr="sm" p="sm" justify="flex-start" wrap="nowrap">
        <Burger
          opened={menuOpened}
          onClick={menuHandlers.toggle}
          hiddenFrom="xs"
          size="sm"
        />
        <AppHeaderOutlet />
      </Group>
    </AppShell.Header>
  );
}

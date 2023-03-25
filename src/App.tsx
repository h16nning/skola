import {
  AppShell,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";

import { getBaseTheme } from "./style/StyleProvider";
import Main from "./components/Main";
import React, { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { Notifications } from "@mantine/notifications";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import Header from "./components/Header";
import { useSetting } from "./logic/Settings";
import WelcomeView from "./components/WelcomeView";

export default function App() {
  const theme = useMantineTheme();
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  const systemColorScheme = useColorScheme();
  const [sidebarOpened, setSidebarOpened] = useState<boolean>(false);

  const [registered, setRegistered] = useLocalStorage({ key: 'registered', defaultValue: false });

  return (
    <ColorSchemeProvider
      colorScheme={
        colorSchemePreference === "system"
          ? systemColorScheme
          : colorSchemePreference
      }
      //not working use setSetting("colorSchemePreference", ...)
      toggleColorScheme={() => {}}
    >
      <MantineProvider
        theme={getBaseTheme(
          theme,
          colorSchemePreference === "system"
            ? systemColorScheme
            : colorSchemePreference
        )}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        {registered ? <AppShell
          navbarOffsetBreakpoint="sm"
          navbar={
            sidebarOpened ? (
              <Sidebar opened={sidebarOpened} setOpened={setSidebarOpened} />
            ) : (
              <></>
            )
          }
          //gradients are currently not used
          /*bg={
            colorScheme === "light"
              ? "linear-gradient(-55deg, rgba(255,255,255,1) 85%, rgba(225,239,230,0.5) 100%)"
              : "linear-gradient(-55deg, rgba(26,27,30,1) 85%, rgba(10,60,49,0.5) 100%)"
          }*/
        >
          <Header
            sidebarOpened={sidebarOpened}
            setSidebarOpened={setSidebarOpened}
          />
          <Main />
        </AppShell> : <WelcomeView />}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

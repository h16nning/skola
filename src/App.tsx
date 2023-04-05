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
import { useSetting } from "./logic/Settings";
import WelcomeView from "./components/WelcomeView";
import { useDynamicPageTheme } from "./logic/ui";

export default function App() {
  const theme = useMantineTheme();
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  const systemColorScheme = useColorScheme();
  const [sidebarMenuOpened, setSidebarMenuOpened] = useState<boolean>(false);

  useDynamicPageTheme(
    theme,
    colorSchemePreference === "system"
      ? systemColorScheme
      : colorSchemePreference
  );

  const [registered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

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
        <Notifications
          transitionDuration={400}
          containerWidth="20rem"
          position="bottom-center"
          autoClose={2000}
          limit={1}
        />
        {registered ? (
          <AppShell
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={
              <Sidebar
                menuOpened={sidebarMenuOpened}
                setMenuOpened={setSidebarMenuOpened}
              />
            }
          >
            <Main
              menuOpened={sidebarMenuOpened}
              setMenuOpened={setSidebarMenuOpened}
            />
          </AppShell>
        ) : (
          <WelcomeView />
        )}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

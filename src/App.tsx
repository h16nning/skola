import {
  AppShell,
  ColorSchemeProvider,
  MantineProvider,
  useMantineTheme,
} from "@mantine/core";

import { getBaseTheme } from "./style/StyleProvider";
import Main from "./components/Main";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { Notifications } from "@mantine/notifications";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { useSetting } from "./logic/Settings";
import WelcomeView from "./components/WelcomeView";
import { useDynamicPageTheme } from "./logic/ui";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

async function persist() {
  return (
    (await navigator.storage) &&
    navigator.storage.persist &&
    navigator.storage.persist()
  );
}

async function isStoragePersisted() {
  return (
    (await navigator.storage) &&
    navigator.storage.persisted &&
    navigator.storage.persisted()
  );
}

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

  useEffect(() => {
    isStoragePersisted().then(async (isPersisted) => {
      if (isPersisted) {
        console.log(":) Storage is successfully persisted.");
      } else {
        console.log(":( Storage is not persisted.");
        console.log("Trying to persist..:");
        if (await persist()) {
          console.log(":) We successfully turned the storage to be persisted.");
        } else {
          console.log(":( Failed to make storage persisted");
        }
      }
    });
  }, []);
  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}

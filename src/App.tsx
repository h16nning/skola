import "@mantine/core/styles.css";
import { AppShell, AppShellNavbar, MantineProvider } from "@mantine/core";
import Main from "./components/Main/Main";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import { Notifications } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { useSetting } from "./logic/Settings";
import WelcomeView from "./components/WelcomeView";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { presetTheme } from "./style/StyleProvider";
import HomeView from "./components/HomeView";
import SettingsView from "./components/settings/SettingsView";
import DeckView from "./components/deck/DeckView";
import FinishedLearningView from "./components/learning/FinishedLearningView/FinishedLearningView";
import { stopwatchResult } from "./components/learning/LearnView/LearnViewHeader";

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
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  const [sidebarMenuOpened, setSidebarMenuOpened] = useState<boolean>(false);

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
      <MantineProvider
        defaultColorScheme={colorSchemePreference}
        theme={presetTheme}
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
            layout="alt"
            navbar={{
              width: { sm: "3.5rem", lg: 300 },
              breakpoint: "xs",
              collapsed: { mobile: !sidebarMenuOpened },
            }}
          >
            <AppShell.Navbar>
              <Sidebar
                menuOpened={sidebarMenuOpened}
                setMenuOpened={setSidebarMenuOpened}
              />
            </AppShell.Navbar>
            <Main
              menuOpened={sidebarMenuOpened}
              setMenuOpened={setSidebarMenuOpened}
            />
          </AppShell>
        ) : (
          <WelcomeView />
        )}
      </MantineProvider>
    </I18nextProvider>
  );
}

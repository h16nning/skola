import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "./style/index.css";

import { AppShell, Center, MantineProvider, Stack } from "@mantine/core";

import classes from "./App.module.css";

import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router-dom";
import WelcomeView from "./app/WelcomeView";
import LoginUI from "./app/login/LoginUI";
import Header from "./app/shell/Header/Header";
import Sidebar from "./app/shell/Sidebar/Sidebar";
import i18n from "./i18n";
import { useSetting } from "./logic/Settings";
import { cssVariablesResolver, presetTheme } from "./style/StyleProvider";

function useRestoreLanguage() {
  const [language] = useSetting("language");
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return language;
}

export default function App() {
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  useRestoreLanguage();
  const [sidebarMenuOpened, sidebarhandlers] = useDisclosure(false);

  const [registered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider
        defaultColorScheme={colorSchemePreference}
        cssVariablesResolver={cssVariablesResolver}
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
              width: { xs: "3.5rem", lg: 300 },
              breakpoint: "xs",
              collapsed: { mobile: !sidebarMenuOpened },
            }}
            header={{ height: 60 }}
          >
            <Header
              menuOpened={sidebarMenuOpened}
              menuHandlers={sidebarhandlers}
            />
            <AppShell.Navbar>
              <Sidebar
                menuOpened={sidebarMenuOpened}
                menuHandlers={sidebarhandlers}
              />
            </AppShell.Navbar>

            <AppShell.Main>
              <Stack>
                <Center className={classes.main}>
                  <Outlet />
                </Center>
              </Stack>
            </AppShell.Main>
            <LoginUI />
          </AppShell>
        ) : (
          <WelcomeView />
        )}
      </MantineProvider>
    </I18nextProvider>
  );
}

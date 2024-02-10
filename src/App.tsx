import { AppShell, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import WelcomeView from "./components/WelcomeView";
import { I18nextProvider } from "react-i18next";
import Main from "./components/Main/Main";
import Sidebar from "./components/sidebar/Sidebar";
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
  const [sidebarMenuOpened, setSidebarMenuOpened] = useState<boolean>(false);

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

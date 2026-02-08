import "./app/shell/AppShell.css";
import "./style/index.css";
import "./style/shell.css";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import WelcomeView from "./app/WelcomeView";
import Header from "./app/shell/Header/Header";
import Sidebar from "./app/shell/Sidebar/Sidebar";
import {
    NotificationContainer,
    NotificationProvider,
    useNotificationSetup,
} from "./components/Notification";
import { useDensity } from "./hooks/useDensity";
import { useTheme } from "./hooks/useTheme";
import i18n from "./i18n";
import { breakpoints } from "./lib/breakpoints";
import { useDisclosure } from "./lib/hooks/useDisclosure";
import { useLocalStorage } from "./lib/hooks/useLocalStorage";
import { useMediaQuery } from "./lib/hooks/useMediaQuery";
import { useSetting } from "./logic/settings/hooks/useSetting";

const BASE = "app-shell";

function useRestoreLanguage() {
  const [language] = useSetting("language");
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return language;
}

function AppContent() {
  useDensity();
  useTheme();
  useRestoreLanguage();
  useNotificationSetup();
  const [sidebarMenuOpened, sidebarHandlers] = useDisclosure(false);

  const [registered] = useLocalStorage("registered", false);

  const routeIsLearn = useLocation().pathname.startsWith("/learn");
  const isXsOrSmaller = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const fullscreenMode = isXsOrSmaller || routeIsLearn;

  useEffect(() => {
    if (routeIsLearn) {
      sidebarHandlers.close();
    } else {
      sidebarHandlers.open();
    }
  }, [routeIsLearn]);

  const overlayClasses = [
    `${BASE}__overlay`,
    fullscreenMode && sidebarMenuOpened && `${BASE}__overlay--visible`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <I18nextProvider i18n={i18n}>
        <NotificationContainer />
        {registered ? (
          <div className={BASE}>
            <Header
              menuOpened={sidebarMenuOpened}
              menuHandlers={sidebarHandlers}
            />
            <div className={`${BASE}__body`}>
              <nav className={`${BASE}__navbar`}>
                <Sidebar
                  menuOpened={sidebarMenuOpened}
                  menuHandlers={sidebarHandlers}
                />
              </nav>
              <div
                className={overlayClasses}
                onClick={sidebarHandlers.close}
                onKeyDown={() => {
                  if (
                    e.key === "Escape" ||
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    sidebarHandlers.close();
                  }
                }}
                role="button"
                tabIndex={fullscreenMode && sidebarMenuOpened ? 0 : -1}
                aria-label="Close sidebar"
              />
            </nav>
            <div
              className={overlayClasses}
              onClick={sidebarHandlers.close}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                  sidebarHandlers.close();
                }
              }}
              role="button"
              tabIndex={fullscreenMode && sidebarMenuOpened ? 0 : -1}
              aria-label="Close sidebar"
            />
            <main className={`${BASE}__main`}>
              <div className={`${BASE}__main-content`}>
                <div className={`${BASE}__main-center`}>
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        ) : (
          <WelcomeView />
        )}
    </I18nextProvider>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

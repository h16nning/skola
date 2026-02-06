import { IconButton } from "@/components/ui/IconButton";
import { NavItem } from "@/components/ui/NavItem";
import { breakpoints } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import {
  IconCards,
  IconChartBar,
  IconHome,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import CloudSection from "./CloudSection";
import DeckList from "./DeckList";
import "./Sidebar.css";

const BASE = "sidebar";

interface SidebarProps {
  menuOpened: boolean;
  menuHandlers: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
}

function Sidebar({ menuOpened, menuHandlers }: SidebarProps) {
  const routeIsLearn = useLocation().pathname.startsWith("/learn");

  const isXsOrSmaller = useMediaQuery(`(max-width: ${breakpoints.xs}px)`);
  const isLgOrSmaller = useMediaQuery(`(max-width: ${breakpoints.lg}px)`);
  const isLandscape = useMediaQuery("(orientation: landscape)");

  const fullscreenMode = isXsOrSmaller || routeIsLearn;
  const minimalMode = isLgOrSmaller && !isXsOrSmaller && !routeIsLearn;

  const sidebarClasses = [
    BASE,
    minimalMode && `${BASE}--minimal`,
    isLandscape && `${BASE}--landscape`,
    fullscreenMode && `${BASE}--fullscreen`,
    fullscreenMode && menuOpened && `${BASE}--open`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={sidebarClasses}>
      <div className={`${BASE}__content`}>
        <div className={`${BASE}__top`}>
          <header className={`${BASE}__header`}>
            <div className={`${BASE}__brand`}>
              <img
                src="/logo.svg"
                alt="Skola Logo"
                className={`${BASE}__logo`}
              />
              {!minimalMode && <h1 className={`${BASE}__title`}>Skola</h1>}
            </div>
            {fullscreenMode && (
              <IconButton
                variant="ghost"
                onClick={menuHandlers.close}
                aria-label="Close menu"
              >
                <IconX />
              </IconButton>
            )}
          </header>

          <nav className={`${BASE}__nav`}>
            <NavItem
              label={t("home.title")}
              path="/home"
              icon={<IconHome />}
              collapsed={minimalMode}
              onClick={fullscreenMode ? menuHandlers.close : undefined}
            />
            <NavItem
              label={t("statistics.title")}
              path="/stats"
              icon={<IconChartBar />}
              collapsed={minimalMode}
              onClick={fullscreenMode ? menuHandlers.close : undefined}
            />
            <NavItem
              label={t("manage-cards.title")}
              path="/notes"
              icon={<IconCards />}
              collapsed={minimalMode}
              onClick={fullscreenMode ? menuHandlers.close : undefined}
            />
            <NavItem
              label={t("settings.title")}
              path="/settings"
              icon={<IconSettings />}
              collapsed={minimalMode}
              onClick={fullscreenMode ? menuHandlers.close : undefined}
            />
          </nav>

          <DeckList minimalMode={minimalMode} />
        </div>

        <CloudSection minimalMode={minimalMode} />
      </div>
    </aside>
  );
}

export default Sidebar;

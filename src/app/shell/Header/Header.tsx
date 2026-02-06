import { HamburgerButton } from "@/components/ui/HamburgerButton";
import { breakpoints } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Header.css";

const BASE = "header";

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
  <div id={APP_HEADER_OUTLET_NAME} className={`${BASE}__outlet`} />
);

export const AppHeaderContent = ({ children }: PropsWithChildren) => {
  const element = document.getElementById(
    APP_HEADER_OUTLET_NAME
  ) as HTMLElement;
  return element && createPortal(children, element);
};

export default function Header({ menuOpened, menuHandlers }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const isXsOrLarger = useMediaQuery(`(min-width: ${breakpoints.xs}px)`);

  useEffect(() => {
    const mainContent = document.querySelector(".app-shell__main-content");
    if (!mainContent) return;

    const handleScroll = () => {
      setScrolled(mainContent.scrollTop > 5);
    };

    mainContent.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      mainContent.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClasses = [BASE, scrolled && `${BASE}--scrolled`]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClasses}>
      <div className={`${BASE}__content`}>
        {!isXsOrLarger && (
          <HamburgerButton
            opened={menuOpened}
            onClick={menuHandlers.toggle}
            size="sm"
          />
        )}
        <AppHeaderOutlet />
      </div>
    </header>
  );
}

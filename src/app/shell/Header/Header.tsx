import { HamburgerButton } from "@/components/ui/HamburgerButton";
import { breakpoints } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useWindowScroll } from "@/lib/hooks/useWindowScroll";
import { PropsWithChildren } from "react";
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
  const [scroll] = useWindowScroll();
  const isXsOrLarger = useMediaQuery(`(min-width: ${breakpoints.xs}px)`);

  const headerClasses = [BASE, scroll.y > 5 && `${BASE}--scrolled`]
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

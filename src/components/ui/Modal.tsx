import { IconX } from "@tabler/icons-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import "./Modal.css";

const BASE = "modal";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  showCloseButton?: boolean;
  exitOnEscape?: boolean;
  fullscreen?: boolean;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function DesktopModal({
  opened,
  onClose,
  title,
  children,
  showCloseButton,
  exitOnEscape,
  fullscreen,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (opened && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else if (!opened && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [opened]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(event: Event) {
      event.preventDefault();
      if (exitOnEscape) {
        onClose();
      }
    }

    function handleClick(event: MouseEvent) {
      if (event.target === dialog) {
        onClose();
      }
    }

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose, exitOnEscape]);

  useEffect(() => {
    if (!opened) return;

    function handleKeyDown(event: KeyboardEvent) {
      event.stopPropagation();
    }

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [opened]);

  const hasHeader = title || showCloseButton;

  const classes = [
    BASE,
    !hasHeader && `${BASE}--no-header`,
    fullscreen && `${BASE}--fullscreen`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog ref={dialogRef} className={classes}>
      {hasHeader && (
        <header className={`${BASE}__header`}>
          {title && <h2 className={`${BASE}__title`}>{title}</h2>}
          {showCloseButton && (
            <button
              type="button"
              className={`${BASE}__close`}
              onClick={onClose}
              aria-label="Close"
            >
              <IconX />
            </button>
          )}
        </header>
      )}
      <div className={`${BASE}__body`}>{children}</div>
    </dialog>
  );
}

function MobileDrawer({
  opened,
  onClose,
  title,
  children,
  showCloseButton,
  fullscreen,
}: ModalProps) {
  const hasHeader = title || showCloseButton;

  return (
    <Drawer.Root open={opened} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="drawer-overlay" />
        <Drawer.Content
          className={`drawer-content ${fullscreen ? "drawer-content--fullscreen" : ""}`}
        >
          <Drawer.Handle className="drawer-handle" />
          {hasHeader && (
            <header className="drawer-header">
              {title && (
                <Drawer.Title className="drawer-title">{title}</Drawer.Title>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="drawer-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <IconX />
                </button>
              )}
            </header>
          )}
          <div className="drawer-body">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function Modal(props: ModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileDrawer {...props} />;
  }

  return <DesktopModal {...props} />;
}

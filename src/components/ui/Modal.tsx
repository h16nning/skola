import { IconX } from "@tabler/icons-react";
import { type ReactNode, useEffect, useRef } from "react";
import "./Modal.css";

const BASE = "modal";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  showCloseButton?: boolean;
  fullscreen?: boolean;
}

export function Modal({
  opened,
  onClose,
  title,
  children,
  showCloseButton = true,
  fullscreen = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (opened && !dialog.open) {
      dialog.showModal();
    } else if (!opened && dialog.open) {
      dialog.close();
    }
  }, [opened]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(event: Event) {
      event.preventDefault();
      onClose();
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
  }, [onClose]);

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

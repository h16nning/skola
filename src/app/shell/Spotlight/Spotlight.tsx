import { Kbd } from "@/components/ui/Kbd";
import { NavItem } from "@/components/ui/NavItem";
import { useDebouncedState } from "@/lib/hooks/useDebouncedState";
import { useHotkeys } from "@/lib/hooks/useHotkeys";
import { useOs } from "@/lib/hooks/useOs";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import { IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Spotlight.css";
import { SpotlightContent } from "./SpotlightContent";

const BASE = "spotlight";

export default function SpotlightCard() {
  const os = useOs();
  const showShortcutHints = useShowShortcutHints();

  const [query, setQuery, immediateQuery] = useDebouncedState("", 50);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setIsDialogOpen(true);
    setSelectedIndex(0);
    dialog.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setIsDialogOpen(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setQuery("");
      setSelectedIndex(0);
      setIsDialogOpen(false);
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [setQuery]);

  useHotkeys([
    [
      os === "macos" ? "meta+k" : "ctrl+k",
      (e) => {
        e.preventDefault();
        open();
      },
      { enableOnInputs: true },
    ],
  ]);

  useEffect(() => {
    if (!isDialogOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const content = dialog.querySelector(`.${BASE}__content`);
          if (!content) return prev;
          const actions = Array.from(
            content.querySelectorAll(`.${BASE}__action`)
          );
          return actions.length > 0 ? (prev + 1) % actions.length : prev;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const content = dialog.querySelector(`.${BASE}__content`);
          if (!content) return prev;
          const actions = Array.from(
            content.querySelectorAll(`.${BASE}__action`)
          );
          return actions.length > 0
            ? (prev - 1 + actions.length) % actions.length
            : prev;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const content = dialog.querySelector(`.${BASE}__content`);
        if (!content) return;
        const actions = Array.from(
          content.querySelectorAll(`.${BASE}__action`)
        );
        const selectedAction = actions[selectedIndex] as HTMLButtonElement;
        selectedAction?.click();
      } else if (e.key === "Tab") {
        e.preventDefault();
        const content = dialog.querySelector(`.${BASE}__content`);
        if (!content) return;
        const selectedAction = content.querySelector(
          `.${BASE}__action--selected`
        );
        const tabAction = selectedAction?.querySelector(
          `.${BASE}__action-tab`
        ) as HTMLElement;
        if (tabAction) {
          const button = selectedAction as HTMLButtonElement;
          const tabButton = button?.querySelector(".kbd")
            ?.nextSibling as HTMLElement;
          if (tabButton) {
            button.click();
          }
        }
      }
    };

    dialog.addEventListener("keydown", onKeyDown);
    return () => dialog.removeEventListener("keydown", onKeyDown);
  }, [close, isDialogOpen, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <>
      <NavItem
        onClick={open}
        label="Search"
        icon={<IconSearch />}
        rightElement={
          showShortcutHints && <Kbd>{os === "macos" ? "⌘" : "Ctrl"} + K</Kbd>
        }
      />

      <dialog
        ref={dialogRef}
        className={`${BASE}__dialog`}
        aria-label="Command palette"
        {...({ closedby: "any" } as React.HTMLAttributes<HTMLDialogElement>)}
      >
        {isDialogOpen && (
          <SpotlightContent
            query={query}
            immediateQuery={immediateQuery}
            setQuery={setQuery}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onClose={close}
          />
        )}
      </dialog>
    </>
  );
}

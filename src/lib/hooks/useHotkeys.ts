import { useEffect } from "react";

type HotkeyHandler = (event: KeyboardEvent) => void;
interface HotkeyOptions {
  preventDefault?: boolean;
  enableOnInputs?: boolean;
}

type HotkeyDefinition = [string, HotkeyHandler, HotkeyOptions?];

export function useHotkeys(hotkeys: HotkeyDefinition[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isEditableElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      for (const [key, handler, options] of hotkeys) {
        if (isEditableElement && !options?.enableOnInputs) {
          continue;
        }

        const keys = key.toLowerCase().split("+");
        let eventKey = event.key.toLowerCase();

        if (eventKey === " ") {
          eventKey = "space";
        }

        const requiresCtrl = keys.includes("ctrl") || keys.includes("control");
        const requiresAlt = keys.includes("alt");
        const requiresShift = keys.includes("shift");
        const requiresMeta = keys.includes("meta") || keys.includes("mod");

        const mainKey = keys.find(
          (k) => !["ctrl", "control", "alt", "shift", "meta", "mod"].includes(k)
        );

        if (!mainKey) continue;

        const ctrlMatch = requiresCtrl ? event.ctrlKey : !event.ctrlKey;
        const altMatch = requiresAlt ? event.altKey : !event.altKey;
        const shiftMatch = requiresShift ? event.shiftKey : !event.shiftKey;
        const metaMatch = requiresMeta ? event.metaKey : !event.metaKey;

        if (
          eventKey === mainKey &&
          ctrlMatch &&
          altMatch &&
          shiftMatch &&
          metaMatch
        ) {
          if (options?.preventDefault !== false) {
            event.preventDefault();
          }
          handler(event);
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hotkeys]);
}

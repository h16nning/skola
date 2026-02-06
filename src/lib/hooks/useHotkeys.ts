import { useEffect } from "react";

type HotkeyHandler = (event: KeyboardEvent) => void;
type HotkeyDefinition = [string, HotkeyHandler, { preventDefault?: boolean }?];

export function useHotkeys(hotkeys: HotkeyDefinition[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const [key, handler, options] of hotkeys) {
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

        const ctrlMatch = requiresCtrl ? event.ctrlKey : true;
        const altMatch = requiresAlt ? event.altKey : true;
        const shiftMatch = requiresShift ? event.shiftKey : true;
        const metaMatch = requiresMeta ? event.metaKey : true;

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

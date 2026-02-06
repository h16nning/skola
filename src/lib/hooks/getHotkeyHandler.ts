type HotkeyHandler = () => void;
type HotkeyDefinition = [string, HotkeyHandler];

export function getHotkeyHandler(hotkeys: HotkeyDefinition[]) {
  return (event: React.KeyboardEvent) => {
    for (const [key, handler] of hotkeys) {
      const keys = key.toLowerCase().split("+");
      const eventKey = event.key.toLowerCase();

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
        event.preventDefault();
        handler();
        break;
      }
    }
  };
}

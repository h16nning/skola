import { useEventListener } from "@/lib/ui";
import { useState } from "react";
import { useSetting } from "./useSetting";

export function useShowShortcutHints() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showShortcutHints] = useSetting("showShortcutHints");
  useEventListener("touchstart", () => setIsTouchDevice(true), []);
  return !isTouchDevice && showShortcutHints;
}

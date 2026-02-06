import { useEffect } from "react";
import { useSetting } from "../logic/settings/hooks/useSetting";

function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
  );
}

function applyDensityFromPreference(
  preference: "relaxed" | "compact" | "auto"
) {
  const root = document.documentElement;

  if (preference === "auto") {
    const isTouch = isTouchDevice();
    if (isTouch) {
      root.removeAttribute("data-density");
    } else {
      root.setAttribute("data-density", "compact");
    }
  } else if (preference === "compact") {
    root.setAttribute("data-density", "compact");
  } else {
    root.removeAttribute("data-density");
  }
}

const storedPreference = localStorage.getItem("settings-densityPreference");
if (storedPreference && typeof window !== "undefined") {
  try {
    const parsed = JSON.parse(storedPreference);
    if (parsed && typeof parsed === "string") {
      applyDensityFromPreference(parsed as "relaxed" | "compact" | "auto");
    }
  } catch {
    applyDensityFromPreference("auto");
  }
} else if (typeof window !== "undefined") {
  applyDensityFromPreference("auto");
}

export function useDensity() {
  const [densityPreference] = useSetting("densityPreference");

  useEffect(() => {
    applyDensityFromPreference(densityPreference);

    if (densityPreference === "auto") {
      const handleResize = () => applyDensityFromPreference(densityPreference);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [densityPreference]);
}

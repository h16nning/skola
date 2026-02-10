import { useEffect } from "react";
import { useSetting } from "../logic/settings/hooks/useSetting";

function applyThemeFromPreference(preference: "light" | "dark" | "auto") {
  const root = document.documentElement;

  if (preference === "auto") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", preference);
  }
}

// Apply theme immediately on module load to prevent flash
const storedPreference = localStorage.getItem("mantine-color-scheme-value");
if (storedPreference) {
  try {
    const parsed = JSON.parse(storedPreference);
    if (parsed && typeof parsed === "string") {
      applyThemeFromPreference(parsed as "light" | "dark" | "auto");
    }
  } catch {
    applyThemeFromPreference("auto");
  }
} else {
  applyThemeFromPreference("auto");
}

export function useTheme() {
  const [colorSchemePreference] = useSetting("#colorSchemePreference");

  useEffect(() => {
    applyThemeFromPreference(colorSchemePreference);

    if (colorSchemePreference === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () =>
        applyThemeFromPreference(colorSchemePreference);

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [colorSchemePreference]);

  return { colorSchemePreference };
}

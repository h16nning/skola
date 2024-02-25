import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "./db";
import { useEventListener } from "./ui";

export type Settings<T extends keyof SettingsValues> = {
  key: T;
  value: SettingsValues[T];
};

export interface SettingsValues {
  name?: string;
  language: "en" | "de" | "es" | "sv";
  useZenMode: boolean;
  developerMode: boolean;
  showShortcutHints: boolean;

  colorSchemePreference: "light" | "dark" | "auto";

  useBubbleMenu: boolean;
  useToolbar: boolean;
  showSubAndSuperScriptOptionInEditor: boolean;
  showStrikethroughOptionInEditor: boolean;
  showHighlightOptionInEditor: boolean;
  showListOptionInEditor: boolean;
  showCodeOptionInEditor: boolean;
  showLinkOptionInEditor: boolean;

  globalScheduler_maximumInterval: number;
  globalScheduler_requestRetention: number;
  globalScheduler_w: number[];
}

export const defaultSettings: SettingsValues = {
  language: "en",
  useZenMode: false,
  developerMode: false,
  showShortcutHints: true,

  colorSchemePreference: "auto",

  useBubbleMenu: true,
  useToolbar: false,
  showSubAndSuperScriptOptionInEditor: true,
  showStrikethroughOptionInEditor: true,
  showHighlightOptionInEditor: true,
  showListOptionInEditor: true,
  showCodeOptionInEditor: true,
  showLinkOptionInEditor: true,

  globalScheduler_maximumInterval: 36500,
  globalScheduler_requestRetention: 0.9,
  globalScheduler_w: [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
    0.34, 1.26, 0.29, 2.61,
  ],
};

export function useSetting<T extends keyof SettingsValues>(
  key: T
): [SettingsValues[T], boolean] {
  return useLiveQuery(
    () =>
      db.settings
        .get(key)
        .then((setting) => [
          (setting?.value as SettingsValues[T]) ?? defaultSettings[key],
          true,
        ]),
    [key],
    [defaultSettings[key], false]
  );
}

export function useSettings(): [SettingsValues, boolean] {
  return useLiveQuery(
    () =>
      db.settings
        .toArray()
        .then((settings) => [
          (settings ?? []).reduce(
            (acc, cur) => ({ ...acc, [cur.key]: cur.value }),
            defaultSettings
          ),
          true,
        ]),
    [],
    [defaultSettings, false]
  );
}

export async function setSetting<T extends keyof SettingsValues>(
  key: T,
  newValue: SettingsValues[T]
) {
  return db.settings.put({ key: key, value: newValue }, key);
}

export function useShowShortcutHints() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showShortcutHints] = useSetting("showShortcutHints");
  useEventListener("touchstart", () => setIsTouchDevice(true), []);
  return !isTouchDevice && showShortcutHints;
}

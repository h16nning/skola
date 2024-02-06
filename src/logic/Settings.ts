import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

export type Settings<T extends keyof SettingsValues> = {
  key: T;
  value: SettingsValues[T];
};

export interface SettingsValues {
  language: "en" | "de" | "es" | "sv";
  colorSchemePreference: "light" | "dark" | "auto";
  name?: string;
  developerMode: boolean;
  showSubAndSuperScriptOptionInEditor: boolean;
  showStrikethroughOptionInEditor: boolean;
  showHighlightOptionInEditor: boolean;
  showListOptionInEditor: boolean;
  showCodeOptionInEditor: boolean;
  showLinkOptionInEditor: boolean;
  useZenMode: boolean;
}

export const defaultSettings: SettingsValues = {
  language: "en",
  colorSchemePreference: "auto",
  developerMode: false,
  showSubAndSuperScriptOptionInEditor: true,
  showStrikethroughOptionInEditor: true,
  showHighlightOptionInEditor: true,
  showListOptionInEditor: true,
  showCodeOptionInEditor: true,
  showLinkOptionInEditor: true,
  useZenMode: false,
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

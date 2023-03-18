import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

export type Settings<T extends keyof SettingsValues> = {
  key: T;
  value: SettingsValues[T];
};

export interface SettingsValues {
  language: "en" | "de" | "es" | "se";
  colorSchemePreference: "light" | "dark" | "system";
  name?: string;
  developerMode: boolean;
}

export const defaultSettings: SettingsValues = {
  language: "en",
  colorSchemePreference: "system",
  developerMode: false,
};

export function useSetting<T extends keyof SettingsValues>(
  key: T
): SettingsValues[T] {
  const query = useLiveQuery(() => db.settings.get(key), [key])?.value;
  return (
    query !== undefined ? query : defaultSettings[key]
  ) as SettingsValues[T];
}
export async function setSetting<T extends keyof SettingsValues>(
  key: T,
  newValue: SettingsValues[T]
) {
  return db.settings.put({ key: key, value: newValue }, key);
}

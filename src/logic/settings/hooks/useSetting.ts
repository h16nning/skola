import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { SettingsValues } from "../Settings";
import { defaultSettings } from "../defaultSettings";

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

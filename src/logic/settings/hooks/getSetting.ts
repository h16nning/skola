import { db } from "../../db";
import { SettingsValues } from "../Settings";
import { defaultSettings } from "../defaultSettings";

export default async function getSetting<T extends keyof SettingsValues>(
  key: T
): Promise<SettingsValues[T]> {
  return await db.settings
    .get(key)
    .then(
      (setting) => (setting?.value as SettingsValues[T]) ?? defaultSettings[key]
    );
}

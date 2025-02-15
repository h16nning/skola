import { db } from "../db";
import { SettingsValues } from "./Settings";

export async function setSetting<T extends keyof SettingsValues>(
  key: T,
  newValue: SettingsValues[T]
) {
  return db.settings.put({ key: key, value: newValue }, key);
}

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";
import { SettingsValues } from "../Settings";
import { defaultSettings } from "../defaultSettings";

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

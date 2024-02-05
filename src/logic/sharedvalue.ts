import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

export interface SharedValue {
  value: string;
  id: string;
}

export async function createSharedValue(value: string): Promise<string> {
  const id = uuidv4();
  await db.sharedvalues.add({
    id: id,
    value: value,
  });
  return id;
}

export async function getSharedValue(id: string) {
  return db.sharedvalues.get(id);
}

export function useSharedValue(id: string) {
  return useLiveQuery(() => db.sharedvalues.get(id), [id], {
    value: "&#8203;",
  });
}

export function setSharedValue(id: string, value: string) {
  return db.sharedvalues.update(id, { value });
}

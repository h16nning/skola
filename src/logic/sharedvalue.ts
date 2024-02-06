import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";

export interface SharedValue {
  value: string;
  id: string;
  referencedBy: string[];
}

export async function createSharedValue(value: string): Promise<string> {
  const id = uuidv4();
  await db.sharedvalues.add({
    id: id,
    value: value,
    referencedBy: [],
  });
  return id;
}

export async function registerReferenceToSharedValue(
  sharedValueId: string,
  cardId: string
) {
  const sharedValue = await db.sharedvalues.get(sharedValueId);
  if (sharedValue) {
    sharedValue.referencedBy.push(cardId);
    await db.sharedvalues.update(sharedValueId, sharedValue);
  }
}

export async function registerReferencesToSharedValue(
  sharedValueId: string,
  cardIds: string[]
) {
  const sharedValue = await db.sharedvalues.get(sharedValueId);
  if (sharedValue) {
    sharedValue.referencedBy.push(...cardIds);
    await db.sharedvalues.update(sharedValueId, sharedValue);
  }
}

export async function getSharedValue(id: string) {
  return db.sharedvalues.get(id);
}

export function useSharedValue(sharedValueId: string) {
  return useLiveQuery(
    () => db.sharedvalues.get(sharedValueId),
    [sharedValueId],
    {
      value: "&#8203;",
    }
  );
}

export function setSharedValue(sharedValueId: string, value: string) {
  return db.sharedvalues.update(sharedValueId, { value });
}

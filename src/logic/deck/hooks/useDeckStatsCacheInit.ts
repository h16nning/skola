import getSetting from "@/logic/settings/hooks/getSetting";
import { useSetting } from "@/logic/settings/hooks/useSetting";
import { useEffect, useState } from "react";
import { db } from "../../db";
import { getOrComputeDeckStats } from "../deckStatsCacheManager";

function getStartOfDay(date: Date, rolloverHour: number): Date {
  const result = new Date(date);
  result.setHours(rolloverHour, 0, 0, 0);

  if (date.getHours() < rolloverHour) {
    result.setDate(result.getDate() - 1);
  }

  return result;
}

async function getNextRolloverTime(): Promise<Date> {
  const newDayStartHour = await getSetting("#newDayStartHour");
  const now = new Date();
  const next = new Date(now);
  next.setHours(newDayStartHour, 0, 0, 0);

  if (now.getHours() >= newDayStartHour) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

async function getMillisecondsUntilNextRollover(): Promise<number> {
  const next = await getNextRolloverTime();
  return next.getTime() - Date.now();
}

async function invalidateAllCaches(): Promise<void> {
  const decks = await db.decks.toArray();
  await Promise.all(
    decks.map((deck) =>
      db.decks.update(deck.id, {
        statCache: undefined,
      })
    )
  );
}

export function useDeckStatsCacheInit() {
  const [newDayStartHour] = useSetting("#newDayStartHour");
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastCheckDay, setLastCheckDay] = useState<Date>(
    getStartOfDay(new Date(), newDayStartHour)
  );

  useEffect(() => {
    console.log(
      "Initializing deck stats cache with newDayStartHour:",
      newDayStartHour
    );
    let isMounted = true;
    let rolloverTimeout: NodeJS.Timeout | null = null;

    const checkAndInvalidateIfNeeded = async () => {
      const currentDayStart = getStartOfDay(new Date(), newDayStartHour);

      if (currentDayStart.getTime() !== lastCheckDay.getTime()) {
        console.log("Day boundary crossed: invalidating all deck stat caches");
        await invalidateAllCaches();
        setLastCheckDay(currentDayStart);
      }
    };

    const scheduleDayRollover = async () => {
      const msUntilRollover = await getMillisecondsUntilNextRollover();

      rolloverTimeout = setTimeout(async () => {
        if (!isMounted) return;

        console.log("Day rollover: invalidating all deck stat caches");
        await invalidateAllCaches();
        setLastCheckDay(getStartOfDay(new Date(), newDayStartHour));

        scheduleDayRollover();
      }, msUntilRollover);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndInvalidateIfNeeded();
      }
    };

    const initializeCaches = async () => {
      try {
        const decks = await db.decks.toArray();

        console.log(
          "Initializing deck stats cache for decks:",
          decks.map((d) => ({ id: d.id, name: d.name }))
        );
        const rootDecks = decks.filter(
          (deck) => !deck.superDecks || deck.superDecks.length === 0
        );

        await Promise.all(
          rootDecks.map((deck) => getOrComputeDeckStats(deck, true))
        );

        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize deck stats cache:", error);
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initializeCaches();
    scheduleDayRollover();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      if (rolloverTimeout) {
        clearTimeout(rolloverTimeout);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastCheckDay]);

  return isInitialized;
}

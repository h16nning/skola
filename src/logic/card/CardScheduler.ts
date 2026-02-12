import * as fsrsjs from "fsrs.js";
import { useEffect } from "react";
import { useSetting } from "../settings/hooks/useSetting";
import { setSetting } from "../settings/setSetting";

const scheduler = new fsrsjs.FSRS();

export function useGlobalScheduler() {
  const [maximumInterval] = useSetting("#globalScheduler_maximumInterval");
  const [requestRetention] = useSetting("#globalScheduler_requestRetention");
  const [w] = useSetting("#globalScheduler_w");
  const parsedW = w.split(",").map((x) => Number.parseFloat(x));

  useEffect(() => {
    scheduler.p.maximum_interval = maximumInterval;
    scheduler.p.request_retention = requestRetention;
    scheduler.p.w = parsedW;
  }, [maximumInterval, requestRetention, w]);
  return scheduler;
}

export function updateGlobalScheduler() {
  setSetting("#globalScheduler_maximumInterval", scheduler.p.maximum_interval);
  setSetting(
    "#globalScheduler_requestRetention",
    scheduler.p.request_retention
  );
  setSetting("#globalScheduler_w", scheduler.p.w.join(","));
}

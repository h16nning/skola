import * as fsrsjs from "fsrs.js";
import { useEffect } from "react";
import { setSetting, useSetting } from "./Settings";

const scheduler = new fsrsjs.FSRS();

export function useGlobalScheduler() {
  const [maximumInterval] = useSetting("globalScheduler_maximumInterval");
  const [requestRetention] = useSetting("globalScheduler_requestRetention");
  const [w] = useSetting("globalScheduler_w");

  useEffect(() => {
    scheduler.p.maximum_interval = maximumInterval;
    scheduler.p.request_retention = requestRetention;
    scheduler.p.w = w;
  }, [maximumInterval, requestRetention, w]);
  return scheduler;
}

export function updateGlobalScheduler() {
  setSetting("globalScheduler_maximumInterval", scheduler.p.maximum_interval);
  setSetting("globalScheduler_requestRetention", scheduler.p.request_retention);
  setSetting("globalScheduler_w", scheduler.p.w);
}

import { StopwatchResult } from "react-timer-hook";

export function getCounterString(stopwatch: StopwatchResult): string {
  const { hours, minutes, seconds } = stopwatch;
  return (
    (hours > 0 ? (hours < 10 ? hours.toString() + "0" : hours) + ":" : "") +
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

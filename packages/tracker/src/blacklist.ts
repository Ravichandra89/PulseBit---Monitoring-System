import { isSameDay } from "./utils";

/**
 * Blacklist dates where we had issues with data collection
 */
export const blacklistDates: Record<string, string> = {
  "Sat Sep 27 2025":
    "Pulsebit faced issues between 24.08. and 27.08., preventing data collection.",
  "Sun Sep 28 2025":
    "Pulsebit faced issues between 24.08. and 27.08., preventing data collection.",
  "Wed Oct 01 2025":
    "Pulsebit migrated from Vercel to Fly to improve the performance of the checker.",
};

export function isInBlacklist(day: Date) {
  const el = Object.keys(blacklistDates).find((date) =>
    isSameDay(new Date(date), day)
  );
  return el ? blacklistDates[el] : undefined;
}

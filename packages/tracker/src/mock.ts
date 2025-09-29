import { Monitor } from "./tracker";
import { Tracker } from "./tracker";

/**
 * Generate mock monitor data ending today.
 * @param days Number of days of data to generate
 */
function generateMockMonitor(days: number): Monitor[] {
  const result: Monitor[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const count = 864; 
    const ok = Math.max(
      0,
      count - Math.floor(Math.random() * 10) 
    );

    result.push({
      day: date.toISOString().split("T")[0] + " 00:00:00",
      count,
      ok,
    });
  }

  return result;
}

export const mockMonitor: Monitor[] = generateMockMonitor(30);

const tracker = new Tracker({ data: mockMonitor });
console.log("Total Uptime:", tracker.totalUptime, "%");
console.log("Days:", tracker.days);

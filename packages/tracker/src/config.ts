/**
 * Converting Internal Tracking Stats into human redable format:
 *   - Long
 *   - short
 *   - varient
 */

import type { StatusDetails, StatusVarient } from "./types";
import { Status } from "./types";

// Define here
export const statusDetails: Record<Status, StatusDetails> = {
  // Operational state
  [Status.Operational]: {
    long: "All System operational",
    short: "Operational",
    variant: "up",
  },

  // Degarded Performance
  [Status.DegardedPerformance]: {
    long: "Degarded Performance",
    short: "Degarded",
    variant: "degarded",
  },

  // Partial Outage
  [Status.PartialOutage]: {
    long: "Partial Outage",
    short: "Outage",
    variant: "down",
  },

  // Major Outage
  [Status.MajorOutage]: {
    long: "Major Outage",
    short: "Outage",
    variant: "down",
  },

  [Status.UnderMaintenance]: {
    long: "Under Maintenance",
    short: "Maintenance",
    variant: "maintenance",
  },

  [Status.Unkown]: {
    long: "Unkown",
    short: "Unkown",
    variant: "empty",
  },

  [Status.Incident]: {
    long: "Downtime",
    short: "Downtime",
    variant: "incident",
  },
};

// More Stats
export const classNames: Record<StatusVarient, string> = {
  up: "bg-status-operational/90 data-[state=open]:bg-status-operational border-status-operational",
  degarded:
    "bg-status-degraded/90 data-[state=open]:bg-status-degraded border-status-degraded",
  down: "bg-status-down/90 data-[state=open]:bg-status-down border-status-down",
  empty: "bg-muted-foreground/20 data-[state=open]:bg-muted-foreground/30",
  incident:
    "bg-status-down/90 data-[state=open]:bg-status-down border-status-down",
  maintenance:
    "bg-status-monitoring/90 data-[state=open]:bg-status-monitoring border-status-monitoring",
};

import type {
  Incident,
  Maintenance as PrismaMaintenance,
  StatusReport,
  StatusReportUpdate,
} from "@prisma/client";

import { isInBlacklist } from "./blacklist";
import { classNames, statusDetails } from "./config";
import type { StatusDetails, StatusVarient } from "./types";
import { Status } from "./types";
import { endOfDay, isSameDay, startOfDay } from "./utils";

// Monitor data type
export type Monitor = {
  count: number;
  ok: number;
  day: string;
};

// Extend StatusReport with updates relation
type StatusReports = (StatusReport & {
  statusReportUpdates?: StatusReportUpdate[];
})[];

type Incidents = Incident[];
type Maintenances = PrismaMaintenance[];

/**
 * Tracker Class
 * Aggregates data and calculates uptime, incidents, reports, and maintenance.
 */
export class Tracker {
  private data: Monitor[] = [];
  private statusReports: StatusReports = [];
  private maintenance: Maintenances = [];
  private incidents: Incidents = [];

  constructor(args: {
    data?: Monitor[];
    statusReports?: StatusReports;
    incidents?: Incidents;
    maintenance?: Maintenances;
  }) {
    this.data = args.data || [];
    this.statusReports = args.statusReports || [];
    this.incidents = args.incidents || [];
    this.maintenance = args.maintenance || [];
  }

  // --- Aggregation helpers ---
  private aggregatedData(data: { ok: number; count: number }[]) {
    return data.reduce(
      (prev, curr) => {
        prev.ok += curr.ok;
        prev.count += curr.count;
        return prev;
      },
      { count: 0, ok: 0 }
    );
  }

  private calculateUpTime(data: { ok: number; count: number }[]) {
    const { count, ok } = this.aggregatedData(data);
    if (count === 0) return 100;
    return Math.round((ok / count) * 10_000) / 100;
  }

  // --- Status helpers ---
  get isDataMissing() {
    const { count } = this.aggregatedData(this.data);
    return count === 0;
  }

  private calculateUptimeStatus(data: { ok: number; count: number }[]) {
    const uptime = this.calculateUpTime(data);
    if (uptime >= 98) return Status.Operational;
    if (uptime >= 60) return Status.DegardedPerformance; // ✅ fixed typo
    if (uptime > 30) return Status.PartialOutage;
    return Status.MajorOutage;
  }

  private isOngoingIncident() {
    return this.incidents.some((incident) => !incident.resolvedAt);
  }

  private isOngoingReport() {
    const resolvedStatuses: StatusReport["status"][] = [
      "monitoring",
      "resolved",
    ];
    return this.statusReports.some(
      (report) => !resolvedStatuses.includes(report.status)
    );
  }

  private isOngoingMaintenance() {
    const now = new Date();
    return this.maintenance.some((maintenance) => {
      return (
        new Date(maintenance.from).getTime() <= now.getTime() &&
        new Date(maintenance.to).getTime() >= now.getTime()
      );
    });
  }

  // --- Getters ---
  get totalUptime(): number {
    return this.calculateUpTime(this.data);
  }

  get currentStatus(): Status {
    if (this.isOngoingMaintenance()) return Status.UnderMaintenance;
    if (this.isOngoingReport()) return Status.DegardedPerformance;
    if (this.isOngoingIncident()) return Status.Incident;
    return this.calculateUptimeStatus(this.data);
  }

  get currentVariant(): StatusVarient {
    return statusDetails[this.currentStatus].variant;
  }

  get currentDetails(): StatusDetails {
    return statusDetails[this.currentStatus];
  }

  get currentClassName(): string {
    return classNames[this.currentVariant];
  }

  // --- Daily breakdown helpers ---
  private getIncidentsByDay(day: Date): Incidents {
    return this.incidents.filter((incident) => {
      const { startedAt, resolvedAt } = incident;
      const eod = endOfDay(day);
      const sod = startOfDay(day);

      if (!startedAt) return false;
      if (startedAt.getTime() >= eod.getTime()) return false;
      if (!resolvedAt) return true; // still ongoing
      if (resolvedAt.getTime() <= sod.getTime()) return false;

      return true;
    });
  }

  private getStatusReportsByDay(props: Monitor): StatusReports {
    return this.statusReports.filter((report) => {
      if (
        !report?.statusReportUpdates ||
        report.statusReportUpdates.length === 0
      ) {
        return false;
      }

      const firstStatusReportUpdate = [...report.statusReportUpdates].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      )[0];

      if (!firstStatusReportUpdate) return false;

      const day = new Date(props.day);
      return isSameDay(firstStatusReportUpdate.date, day);
    });
  }

  private getMaintenancesByDay(day: Date): Maintenances {
    const eod = endOfDay(day);
    const sod = startOfDay(day);
    return this.maintenance.filter((maintenance) => {
      return (
        maintenance.from.getTime() <= eod.getTime() &&
        maintenance.to.getTime() >= sod.getTime()
      );
    });
  }

  // --- Daily breakdown ---
  get days() {
    return this.data.map((props) => {
      const day = new Date(props.day);
      const blacklist = isInBlacklist(day);
      const incidents = this.getIncidentsByDay(day);
      const statusReports = this.getStatusReportsByDay(props);
      const maintenances = this.getMaintenancesByDay(day);

      const isMissingData = props.count === 0;

      // Explicitly assert type as Status
      const status: Status = maintenances.length
        ? Status.UnderMaintenance
        : statusReports.length
          ? Status.DegardedPerformance
          : incidents.length
            ? Status.Incident
            : isMissingData
              ? Status.Unkown
              : this.calculateUptimeStatus([props]);

      const details = statusDetails[status]; // ✅ now strongly typed
      const variant = details.variant;
      const label = isMissingData ? "Missing" : details.short;

      return {
        ...props,
        blacklist,
        incidents,
        statusReports,
        maintenances,
        status,
        variant,
        label,
      };
    });
  }

  toString() {
    return statusDetails[this.currentStatus].short;
  }
}

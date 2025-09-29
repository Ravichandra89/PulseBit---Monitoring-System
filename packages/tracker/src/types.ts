import prismaClient from "@pulsebit/db";
import {
  Incident as PrismaIncident,
  StatusReport as PrismaStatusReport,
} from "@prisma/client";

export enum Status {
  Operational = "operational",
  DegardedPerformance = "degarded_performance",
  PartialOutage = "partial_outage",
  MajorOutage = "major_outage",
  UnderMaintenance = "under_maintenance",
  Unkown = "unkown",
  Incident = "incident",
}

export type StatusVarient =
  | "up"
  | "degarded"
  | "down"
  | "empty"
  | "incident"
  | "maintenance";

export type StatusDetails = {
  long: String;
  short: String;
  variant: StatusVarient;
};

export type TrackerData = {
  ok: number;
  count: number;
  date: Date;
  incident: PrismaIncident[];
  statusReport: PrismaStatusReport[];
  status: Status;
  varient: StatusVarient;
};

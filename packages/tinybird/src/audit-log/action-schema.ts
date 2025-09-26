import { z } from "zod";

/**
 * Defining schema's monitorRecoverSchema
 */
export const monitorRecoverSchema = z.object({
  action: z.literal("monitor.recovered"),
  metadata: z.object({
    region: z.string(),
    statusCode: z.number(),
    latency: z.number().optional(),
    cronTimestamp: z.number().optional(),
  }),
});

/**
 * It represents the event when a monitor has recovered from a failure.
 */
export const monitorDegardedSchema = z.object({
  action: z.literal("monitor.degraded"),
  metadata: z.object({
    region: z.string(),
    statusCode: z.number(),
    cronTimestamp: z.number().optional(),
    latency: z.number().optional(),
  }),
});

/**
 * MonitorFailedSchema Event
 */
export const monitorFailedSchema = z.object({
  action: z.literal("monitor.failed"),
  metadata: z.object({
    region: z.string(),
    statusCode: z.string().optional(),
    message: z.string().optional(),
    latency: z.number().optional(),
    cronTimestamp: z.number().optional(),
  }),
});

/**
 * Notification send action schema
 */
export const notificationSentSchema = z.object({
  action: z.literal("notification.sent"),
  metadata: z.object({
    provider: z.string(),
    cronTimestamp: z.number().optional(),
    type: z.enum(["alert", "recovery", "degarded"]).optional(),
    notificationId: z.number().optional(),
  }),
});

/**
 * Incident Schema
 */

export const incidentCreatedSchema = z.object({
  action: z.literal("incident.created"),
  metadata: z.object({
    cronTimestamp: z.number().optional(),
    incidentId: z.number().optional(),
  }),
});

/**
 * Incident Resolved Schema
 */
export const incidentResolvedSchema = z.object({
  action: z.literal("incident.resolved"),
  metadata: z.object({
    cronTimestamp: z.number().optional(),
    incidentId: z.number().optional(),
  }),
});

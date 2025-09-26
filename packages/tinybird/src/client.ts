import { Tinybird as Client, NoopTinybird } from "@chronark/zod-bird";
import { z } from "zod";
import {
  headersSchema,
  timingPhasesSchema,
  timingSchema,
  triggers,
} from "./schema";

const PUBLIC_CACHE = 300; // 5 * 60 = 300s = 5m
const DEV_CACHE = 10 * 60; // 10m
const REVALIDATE = process.env.NODE_ENV === "development" ? DEV_CACHE : 0;

export class OSTinybird {
  private readonly tb: Client;

  constructor(token: string) {
    this.tb =
      process.env.NODE_ENV === "development"
        ? new NoopTinybird()
        : new Client({ token });
  }

  get homeStats() {
    return this.tb.buildPipe({
      pipe: "endpoint__stats_global__v0",
      parameters: z.object({
        cronTimestamp: z.number().int().optional(),
        period: z.enum(["total", "1h", "10m", "1d", "1w", "1m"]).optional(),
      }),
      data: z.object({
        count: z.number().int(),
      }),
      opts: { cache: "force-cache" },
    });
  }

  get legacy_httpListDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_list_1d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpListDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_list_1d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.number().int().optional(),
        toDate: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        id: z.string().nullable(),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        timing: timingPhasesSchema,
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_httpListWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_list_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpListWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_list_7d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.number().int().optional(),
        toDate: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        id: z.string().nullable(),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        timing: timingPhasesSchema,
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_httpListBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_list_14d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpListBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_list_14d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.number().int().optional(),
        toDate: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        id: z.string().nullable(),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        timing: timingPhasesSchema,
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_httpMetricsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_1d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int(),
        ok: z.number().int(),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_1d__v1",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int().default(0),
        success: z.number().int().default(0),
        degraded: z.number().int().default(0),
        error: z.number().int().default(0),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_httpMetricsWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_7d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int(),
        ok: z.number().int(),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_7d__v1",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int().default(0),
        success: z.number().int().default(0),
        degraded: z.number().int().default(0),
        error: z.number().int().default(0),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_httpMetricsBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_14d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int(),
        ok: z.number().int(),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_14d__v1",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int().default(0),
        success: z.number().int().default(0),
        degraded: z.number().int().default(0),
        error: z.number().int().default(0),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsByIntervalDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_by_interval_1d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsByIntervalWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_by_interval_7d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsByIntervalBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_by_interval_14d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsByRegionDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_by_region_1d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        count: z.number().int(),
        ok: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsByRegionWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_by_region_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        count: z.number().int(),
        ok: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsByRegionBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_by_region_14d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        count: z.number().int(),
        ok: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpStatusWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_status_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().default(0),
        ok: z.number().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_httpStatus45d() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_status_45d__v0",
      parameters: z.object({
        monitorId: z.string(),
        days: z.number().int().max(45).optional(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().default(0),
        ok: z.number().default(0),
      }),
      opts: { next: { revalidate: PUBLIC_CACHE } },
    });
  }

  get httpStatus45d() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_status_45d__v1",
      parameters: z.object({
        monitorIds: z.string().array(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().default(0),
        ok: z.number().default(0),
        degraded: z.number().default(0),
        error: z.number().default(0),
        monitorId: z.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpGetBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_get_14d__v0",
      parameters: z.object({
        id: z.string().nullable(),
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        monitorId: z.string(),
        url: z.string().url(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        message: z.string().nullable(),
        headers: headersSchema,
        timing: timingPhasesSchema,
        assertions: z.string().nullable(),
        body: z.string().nullable(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.string(),
        id: z.string().nullable(),
      }),
      opts: { cache: "force-cache" },
    });
  }

  get httpGetMonthly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_get_30d__v0",
      parameters: z.object({
        monitorId: z.string(),
        cronTimestamp: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("http").default("http"),
        latency: z.number().int(),
        statusCode: z.number().int().nullable(),
        monitorId: z.string(),
        url: z.string().url(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        message: z.string().nullable(),
        headers: headersSchema,
        timing: timingSchema,
        assertions: z.string().nullable(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.string(),
      }),
      opts: { cache: "force-cache" },
    });
  }

  get getResultForOnDemandCheckHttp() {
    return this.tb.buildPipe({
      pipe: "get_result_for_on_demand_check_http",
      parameters: z.object({
        monitorId: z.number().int(),
        timestamp: z.number(),
        url: z.string(),
      }),
      data: z.object({
        latency: z.number().int(),
        statusCode: z.number().int().nullable().default(null),
        monitorId: z.string().default(""),
        url: z.string().url().optional(),
        error: z
          .number()
          .default(0)
          .transform((val) => val !== 0),
        timestamp: z.number().int().optional(),
        message: z.string().nullable().optional(),
        timing: timingSchema,
      }),
      opts: { cache: "no-store" },
    });
  }

  get legacy_tcpListDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_list_1d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.coerce.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpListDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_list_1d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.number().int().optional(),
        toDate: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        id: z.string().nullable(),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_tcpListWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_list_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.coerce.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpListWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_list_7d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.number().int().optional(),
        toDate: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        id: z.string().nullable(),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_tcpListBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_list_14d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.coerce.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpListBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_list_14d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.number().int().optional(),
        toDate: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        id: z.string().nullable(),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_tcpMetricsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_1d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int(),
        ok: z.number().int(),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_1d__v1",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int().default(0),
        success: z.number().int().default(0),
        degraded: z.number().int().default(0),
        error: z.number().int().default(0),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_tcpMetricsWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_7d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int(),
        ok: z.number().int(),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_7d__v1",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int().default(0),
        success: z.number().int().default(0),
        degraded: z.number().int().default(0),
        error: z.number().int().default(0),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_tcpMetricsBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_14d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int(),
        ok: z.number().int(),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_14d__v1",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
        count: z.number().int().default(0),
        success: z.number().int().default(0),
        degraded: z.number().int().default(0),
        error: z.number().int().default(0),
        lastTimestamp: z.number().int().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsByIntervalDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_by_interval_1d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsByIntervalWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_by_interval_7d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsByIntervalBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_by_interval_14d__v0",
      parameters: z.object({
        interval: z.number().int().optional(),
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsByRegionDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_by_region_1d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        count: z.number().int(),
        ok: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsByRegionWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_by_region_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        count: z.number().int(),
        ok: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsByRegionBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_by_region_14d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        count: z.number().int(),
        ok: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpStatusWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_status_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().default(0),
        ok: z.number().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get legacy_tcpStatus45d() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_status_45d__v0",
      parameters: z.object({
        monitorId: z.string(),
        days: z.number().int().max(45).optional(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().default(0),
        ok: z.number().default(0),
      }),
      opts: { next: { revalidate: PUBLIC_CACHE } },
    });
  }

  get tcpStatus45d() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_status_45d__v1",
      parameters: z.object({
        monitorIds: z.string().array(),
        days: z.number().int().max(45).optional(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().default(0),
        ok: z.number().default(0),
        degraded: z.number().default(0),
        error: z.number().default(0),
        monitorId: z.coerce.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpWorkspace30d() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_workspace_30d__v0",
      parameters: z.object({
        workspaceId: z.string(),
      }),
      data: z.object({
        day: z
          .string()
          .transform((val) => new Date(`${val} GMT`).toISOString()),
        count: z.number().int(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpGetBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_get_14d__v0",
      parameters: z.object({
        id: z.string().nullable(),
        monitorId: z.string(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        id: z.string().nullable(),
        uri: z.string(),
        latency: z.number().int(),
        monitorId: z.coerce.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        requestStatus: z.enum(["error", "success", "degraded"]).nullable(),
        errorMessage: z.string().nullable(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpGetMonthly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_get_30d__v0",
      parameters: z.object({
        monitorId: z.string(),
        cronTimestamp: z.number().int().optional(),
      }),
      data: z.object({
        type: z.literal("tcp").default("tcp"),
        latency: z.number().int(),
        monitorId: z.string(),
        error: z.coerce.boolean(),
        cronTimestamp: z.number().int(),
        trigger: z.enum(triggers).nullable().default("cron"),
        timestamp: z.number(),
        workspaceId: z.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsRegionsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_regions_1d__v0",
      parameters: z.object({
        monitorId: z.string(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsRegionsWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_regions_7d__v0",
      parameters: z.object({
        monitorId: z.string(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpMetricsRegionsBiweekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_regions_14d__v0",
      parameters: z.object({
        monitorId: z.string(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().nullable().default(0),
        p75Latency: z.number().nullable().default(0),
        p90Latency: z.number().nullable().default(0),
        p95Latency: z.number().nullable().default(0),
        p99Latency: z.number().nullable().default(0),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpUptimeWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_uptime_7d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.string().optional(),
        toDate: z.string().optional(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        interval: z.coerce.date(),
        success: z.number().int(),
        degraded: z.number().int(),
        error: z.number().int(),
      }),
    });
  }

  get httpUptime30d() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_uptime_30d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.string().optional(),
        toDate: z.string().optional(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        interval: z.coerce.date(),
        success: z.number().int(),
        degraded: z.number().int(),
        error: z.number().int(),
      }),
    });
  }

  get tcpUptimeWeekly() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_uptime_7d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.string().optional(),
        toDate: z.string().optional(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        interval: z.coerce.date(),
        success: z.number().int(),
        degraded: z.number().int(),
        error: z.number().int(),
      }),
    });
  }

  get tcpUptime30d() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_uptime_30d__v1",
      parameters: z.object({
        monitorId: z.string(),
        fromDate: z.string().optional(),
        toDate: z.string().optional(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        interval: z.coerce.date(),
        success: z.number().int(),
        degraded: z.number().int(),
        error: z.number().int(),
      }),
    });
  }

  get getAuditLog() {
    return this.tb.buildPipe({
      pipe: "endpoint__audit_log__v1",
      parameters: z.object({
        monitorId: z.string(),
        interval: z.number().int().default(30),
      }),
      data: z.object({
        action: z.string(),
        id: z.string(),
        metadata: z.string().transform((str) => {
          try {
            return JSON.parse(str) as Record<string, unknown>;
          } catch (error) {
            console.error(error);
            return {};
          }
        }),
        timestamp: z.number().int(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpGlobalMetricsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_global_1d__v0",
      parameters: z.object({
        monitorIds: z.string().array(),
      }),
      data: z.object({
        minLatency: z.number().int(),
        maxLatency: z.number().int(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
        lastTimestamp: z.number().int(),
        count: z.number().int(),
        monitorId: z.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpGlobalMetricsDaily() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_global_1d__v0",
      parameters: z.object({
        monitorIds: z.string().array(),
      }),
      data: z.object({
        minLatency: z.number().int(),
        maxLatency: z.number().int(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
        lastTimestamp: z.number().int(),
        count: z.number().int(),
        monitorId: z.coerce.string(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get httpTimingPhases14d() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_timing_phases_14d__v1",
      parameters: z.object({
        monitorId: z.string(),
        interval: z.number().int().optional(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Dns: z.number().int(),
        p50Ttfb: z.number().int(),
        p50Transfer: z.number().int(),
        p50Connect: z.number().int(),
        p50Tls: z.number().int(),
        p75Dns: z.number().int(),
        p75Ttfb: z.number().int(),
        p75Transfer: z.number().int(),
        p75Connect: z.number().int(),
        p75Tls: z.number().int(),
        p90Dns: z.number().int(),
        p90Ttfb: z.number().int(),
        p90Transfer: z.number().int(),
        p90Connect: z.number().int(),
        p90Tls: z.number().int(),
        p95Dns: z.number().int(),
        p95Ttfb: z.number().int(),
        p95Transfer: z.number().int(),
        p95Connect: z.number().int(),
        p95Tls: z.number().int(),
        p99Dns: z.number().int(),
        p99Ttfb: z.number().int(),
        p99Transfer: z.number().int(),
        p99Connect: z.number().int(),
        p99Tls: z.number().int(),
      }),
    });
  }

  get httpMetricsLatency1d() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_latency_1d__v1",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
      }),
    });
  }

  get httpMetricsLatency7d() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_latency_7d__v1",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
      }),
    });
  }

  get httpMetricsLatency1dMulti() {
    return this.tb.buildPipe({
      pipe: "endpoint__http_metrics_latency_1d_multi__v1",
      parameters: z.object({
        monitorIds: z.string().array().min(1),
      }),
      data: z.object({
        timestamp: z.number().int(),
        monitorId: z.string(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }

  get tcpMetricsLatency1d() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_latency_1d__v1",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
      }),
    });
  }

  get tcpMetricsLatency7d() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_latency_7d__v1",
      parameters: z.object({
        monitorId: z.string(),
      }),
      data: z.object({
        timestamp: z.number().int(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
      }),
    });
  }

  get tcpMetricsLatency1dMulti() {
    return this.tb.buildPipe({
      pipe: "endpoint__tcp_metrics_latency_1d_multi__v1",
      parameters: z.object({
        monitorIds: z.string().array().min(1),
      }),
      data: z.object({
        timestamp: z.number().int(),
        monitorId: z.coerce.string(),
        p50Latency: z.number().int(),
        p75Latency: z.number().int(),
        p90Latency: z.number().int(),
        p95Latency: z.number().int(),
        p99Latency: z.number().int(),
      }),
      opts: { next: { revalidate: REVALIDATE } },
    });
  }
}

import { z } from "zod";

import {
  incidentCreatedSchema,
  incidentResolvedSchema,
  monitorDegardedSchema,
  monitorFailedSchema,
  monitorRecoverSchema,
  notificationSentSchema,
} from "./action-schema";

import { ingestBaseEventSchema, pipeBaseResponseData } from "./base-validation";

export const ingestActionEventSchema = z
  .intersection(
    // Unfortunately, the array cannot be dynamic, otherwise could be added to the Client
    // and made available to devs as library
    z.discriminatedUnion("action", [
      monitorRecoverSchema,
      monitorDegardedSchema,
      monitorFailedSchema,
      notificationSentSchema,
      incidentCreatedSchema,
      incidentResolvedSchema,
    ]),
    ingestBaseEventSchema
  )
  .transform((val) => ({
    ...val,
    metadata: JSON.stringify(val.metadata),
  }));

export const pipeActionResponseData = z.intersection(
  z.discriminatedUnion("action", [
    monitorRecoverSchema.extend({
      metadata: z.preprocess(
        (val) => JSON.parse(String(val)),
        monitorRecoverSchema.shape.metadata
      ),
    }),
    monitorDegardedSchema.extend({
      metadata: z.preprocess(
        (val) => JSON.parse(String(val)),
        monitorDegardedSchema.shape.metadata
      ),
    }),
    monitorFailedSchema.extend({
      metadata: z.preprocess(
        (val) => JSON.parse(String(val)),
        monitorFailedSchema.shape.metadata
      ),
    }),
    notificationSentSchema.extend({
      metadata: z.preprocess(
        (val) => JSON.parse(String(val)),
        notificationSentSchema.shape.metadata
      ),
    }),
    incidentCreatedSchema.extend({
      metadata: z.preprocess(
        (val) => JSON.parse(String(val)),
        incidentCreatedSchema.shape.metadata
      ),
    }),
    incidentResolvedSchema.extend({
      metadata: z.preprocess(
        (val) => JSON.parse(String(val)),
        incidentResolvedSchema.shape.metadata
      ),
    }),
  ]),
  pipeBaseResponseData
);

export type IngestActionEvent = z.infer<typeof ingestActionEventSchema>;
export type PipeActionResponseData = z.infer<typeof pipeActionResponseData>;

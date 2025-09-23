import { z } from "zod";

export const errorCodes = [
  "BAD_REQUEST",
  "FORBIDDEN",
  "INTERNAL_SERVER_ERROR",
  "PAYMENT_REQUIRED",
  "CONFLICT",
  "NOT_FOUND",
  "UNAUTHORIZED",
  "METHOD_NOT_ALLOWED",
  "UNPROCESSADBLE_ENTITY",
] as const;

export const ErrorCodeEnum = z.enum(errorCodes);

export type ErrorCode = z.infer<typeof ErrorCodeEnum>;

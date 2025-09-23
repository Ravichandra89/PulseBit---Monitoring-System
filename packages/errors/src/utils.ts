import type { ZodIssue, z } from "zod";
import type { ErrorCode } from "./error-code";

/**
 * @param status codeToStatus & statusToCode Conversion
 * @returns code: number / Status: string
 */
export const statusToCode = (status: number): ErrorCode => {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 402:
      return "PAYMENT_REQUIRED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 405:
      return "METHOD_NOT_ALLOWED";
    case 409:
      return "CONFLICT";
    case 422:
      return "UNPROCESSADBLE_ENTITY";
    case 500:
      return "INTERNAL_SERVER_ERROR";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
};

export const codeToStatus = (code: ErrorCode) => {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "PAYMENT_REQUIRED":
      return 402;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "METHOD_NOT_ALLOWED":
      return 405;
    case "CONFLICT":
      return 409;
    case "UNPROCESSADBLE_ENTITY":
      return 422;
    case "INTERNAL_SERVER_ERROR":
      return 500;
    default:
      return 500;
  }
};

// Zod issue parser
export function parseZodErrorIssues(issues: ZodIssue[]): string {
  return issues
    .map((issue) => {
      if (issue.code === "invalid_union") {
        return issue.unionErrors
          .map((err) => parseZodErrorIssues(err.issues))
          .join("; ");
      }

      if (issue.code === "unrecognized_keys") {
        return issue.message;
      }

      const path = issue.path.length ? ` in '${issue.path.join(".")}'` : "";
      return `${issue.code}${path}: ${issue.message}`;
    })
    .join("; ");
}

export function redactError<TError extends Error | unknown>(err: TError) {
  if (!(err instanceof Error)) return err;
  console.error(`Type of Error: ${err.constructor}`);
}

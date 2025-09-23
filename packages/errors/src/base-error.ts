import type { ErrorCode } from "./error-code";

type ErrorContext = Record<string, unknown>;

export abstract class BaseError<
  TContext extends ErrorContext = ErrorContext,
> extends Error {
  public abstract readonly name: string;
  public abstract readonly code?: ErrorCode;
  public readonly cause?: BaseError;
  public readonly context?: TContext;

  constructor(opts: {
    message: string;
    cause?: BaseError;
    context?: TContext;
  }) {
    super(opts.message);
    this.cause = opts.cause;
    this.context = opts.context;
  }

  public toString(): string {
    return `${this.name}(${this.code}): ${
      this.message
    } - caused by ${this.cause?.toString()} - with context ${JSON.stringify(
      this.context
    )}`;
  }
}

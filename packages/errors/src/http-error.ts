import { BaseError } from "./base-error";
import type { ErrorCode } from "./error-code";
import { statusToCode } from "./utils";

type context = {
  url?: string;
  method?: string;
  statusCode?: number;
};

export class HttpError extends BaseError<context> {
  public readonly name = HttpError.name;
  public readonly code: ErrorCode;

  // constructor
  constructor(opts: {
    code: ErrorCode;
    message: string;
    cause?: BaseError;
    context: context;
  }) {
    super(opts);
    this.code = opts.code;
  }

  public static fromRequest(request: Request, response: Response) {
    return new HttpError({
      code: statusToCode(response.status),
      message: response.statusText,
      context: {
        url: request.url,
        method: request.method,
        statusCode: response.status,
      },
    });
  }
}

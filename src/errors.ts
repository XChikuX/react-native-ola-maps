export type IndiaMapsErrorCode =
  | 'CONFIGURATION_ERROR'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'PARSE_ERROR'
  | 'UNSUPPORTED_ERROR';

export class IndiaMapsError extends Error {
  readonly code: IndiaMapsErrorCode;
  readonly status?: number;
  readonly response?: unknown;

  constructor(
    message: string,
    code: IndiaMapsErrorCode = 'API_ERROR',
    options?: { status?: number; response?: unknown }
  ) {
    super(message);
    this.name = 'IndiaMapsError';
    this.code = code;
    this.status = options?.status;
    this.response = options?.response;
  }
}

export { IndiaMapsError as OlaMapsError };
export type OlaMapsErrorCode = IndiaMapsErrorCode;

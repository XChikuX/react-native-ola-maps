export type OlaMapsErrorCode =
  | 'CONFIGURATION_ERROR'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'PARSE_ERROR';

export class OlaMapsError extends Error {
  readonly code: OlaMapsErrorCode;
  readonly status?: number;
  readonly response?: unknown;

  constructor(
    message: string,
    code: OlaMapsErrorCode = 'API_ERROR',
    options?: { status?: number; response?: unknown }
  ) {
    super(message);
    this.name = 'OlaMapsError';
    this.code = code;
    this.status = options?.status;
    this.response = options?.response;
  }
}

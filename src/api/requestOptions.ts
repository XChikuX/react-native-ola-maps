type ParamValue = string | number | boolean | undefined | null;

/** Options for a single HTTP request performed by an API module. */
export type RequestOptions = Omit<RequestInit, 'body'> & {
  /** Query parameters; `undefined` and `null` values are omitted. */
  params?: Record<string, ParamValue>;

  /** Request body; plain objects and arrays are JSON-serialized. */
  body?: BodyInit | Record<string, unknown> | unknown[];

  /** Set when the body is already a serialized string. */
  skipJsonSerialization?: boolean;
};

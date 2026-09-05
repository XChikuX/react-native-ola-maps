import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Observable state of an asynchronous request. */
export type AsyncState<TResult> = {
  /** Last successful result, or `undefined`. */
  data: TResult | undefined;

  /** Last failure, or `undefined`. Errors are also rethrown by `execute`. */
  error: Error | undefined;

  /** Whether a request is in flight. */
  loading: boolean;
};

/** Options for {@linkcode useAsyncRequest}. */
export type AsyncRequestOptions<TArgs extends unknown[]> = {
  /** Arguments used to run the request automatically on mount (and when they change). */
  immediateArgs?: TArgs;

  /** Set to `false` to skip the automatic request. @default true */
  enabled?: boolean;
};

/**
 * Generic request-state adapter: tracks `data`, `error` and `loading` for one
 * async function. Hooks like {@linkcode useDirections} are thin wrappers
 * around this.
 */
export function useAsyncRequest<TArgs extends unknown[], TResult>(
  request: (...args: TArgs) => Promise<TResult>,
  options?: AsyncRequestOptions<TArgs>
) {
  const mountedRef = useRef(true);
  const [state, setState] = useState<AsyncState<TResult>>({
    data: undefined,
    error: undefined,
    loading: false,
  });

  const execute = useCallback(
    async (...args: TArgs) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: undefined,
      }));
      try {
        const data = await request(...args);
        if (mountedRef.current) {
          setState({ data, error: undefined, loading: false });
        }
        return data;
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        if (mountedRef.current) {
          setState({ data: undefined, error: normalizedError, loading: false });
        }
        throw normalizedError;
      }
    },
    [request]
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const immediateArgs = options?.immediateArgs;
  const enabled = options?.enabled;

  // Serialize args so an inline array literal does not retrigger the request
  // on every render; only actual value changes do.
  const immediateArgsKey = useMemo(
    () => (immediateArgs ? JSON.stringify(immediateArgs) : undefined),
    [immediateArgs]
  );

  useEffect(() => {
    if (enabled === false || immediateArgsKey === undefined) {
      return;
    }
    const args = JSON.parse(immediateArgsKey) as TArgs;
    execute(...args).catch(() => undefined);
  }, [enabled, execute, immediateArgsKey]);

  return { ...state, execute };
}

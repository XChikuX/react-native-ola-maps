import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncState<T> = {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
};

export function useAsyncRequest<TArgs extends unknown[], TResult>(
  request: (...args: TArgs) => Promise<TResult>,
  options?: { immediateArgs?: TArgs; enabled?: boolean }
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

  useEffect(() => {
    if (options?.enabled !== false && options?.immediateArgs) {
      execute(...options.immediateArgs).catch(() => undefined);
    }
  }, [execute, options?.enabled, options?.immediateArgs]);

  return { ...state, execute };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOlaMaps } from './useOlaMaps';
import type { AutocompleteOptions, AutocompleteResult } from '../types/places';

export function useAutocomplete(
  options?: AutocompleteOptions & { debounceMs?: number }
) {
  const client = useOlaMaps();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const search = useCallback(
    async (input: string) => {
      setQuery(input);
      if (!input.trim()) {
        setResults([]);
        return [];
      }

      setLoading(true);
      setError(undefined);
      try {
        const response = await client.places.autocomplete(input, options);
        setResults(response.data);
        return response.data;
      } catch (searchError) {
        const normalizedError =
          searchError instanceof Error
            ? searchError
            : new Error(String(searchError));
        setError(normalizedError);
        throw normalizedError;
      } finally {
        setLoading(false);
      }
    },
    [client, options]
  );

  const debouncedSearch = useCallback(
    (input: string) => {
      setQuery(input);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        search(input).catch(() => undefined);
      }, options?.debounceMs ?? 250);
    },
    [options?.debounceMs, search]
  );

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  return { query, setQuery, results, loading, error, search, debouncedSearch };
}

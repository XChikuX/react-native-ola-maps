import { useCallback, useEffect, useRef, useState } from 'react';
import { useIndiaMaps } from './useIndiaMaps';
import type {
  AutocompleteOptions,
  AutocompleteSuggestion,
} from '../types/places';

/** Options for {@linkcode useAutocomplete}: autocomplete options plus debounce. */
export type UseAutocompleteOptions = AutocompleteOptions & {
  /** Delay in milliseconds before a debounced search fires. @default 250 */
  debounceMs?: number;
};

/**
 * Autocomplete search state with debouncing, backed by
 * {@linkcode PlacesApi.autocomplete}.
 *
 * @example
 * const { results, debouncedSearch } = useAutocomplete({ debounceMs: 300 });
 * debouncedSearch('koram');
 */
export function useAutocomplete(options?: UseAutocompleteOptions) {
  const client = useIndiaMaps();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteSuggestion[]>([]);
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
        const suggestions = await client.places.autocomplete(input, options);
        setResults(suggestions);
        return suggestions;
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

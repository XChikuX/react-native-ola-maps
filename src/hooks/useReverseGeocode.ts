import { useCallback } from 'react';
import { useOlaMaps } from './useOlaMaps';
import { useAsyncRequest } from './useAsyncRequest';
import type { Language } from '../types/common';

export function useReverseGeocode(initialArgs?: [number, number, Language?]) {
  const client = useOlaMaps();
  const request = useCallback(
    (lat: number, lng: number, language?: Language) =>
      client.places.reverseGeocode(lat, lng, language),
    [client]
  );
  return useAsyncRequest(request, { immediateArgs: initialArgs });
}

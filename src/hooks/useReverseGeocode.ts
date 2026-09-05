import { useCallback } from 'react';
import { useIndiaMaps } from './useIndiaMaps';
import { useAsyncRequest } from './useAsyncRequest';
import type { AsyncRequestOptions } from './useAsyncRequest';
import type { ReverseGeocodeOptions } from '../types/places';
import type { LatLngInput } from '../types/common';

/** Arguments for the automatic request: `[location, options?]`. */
export type UseReverseGeocodeArgs = [
  location: LatLngInput,
  options?: ReverseGeocodeOptions,
];

/**
 * Reverse-geocoding request state backed by
 * {@linkcode PlacesApi.reverseGeocode}.
 *
 * @example
 * const { data, execute } = useReverseGeocode();
 * const results = await execute({ latitude: 28.6139, longitude: 77.209 });
 */
export function useReverseGeocode(initialArgs?: UseReverseGeocodeArgs) {
  const client = useIndiaMaps();
  const request = useCallback(
    (location: LatLngInput, options?: ReverseGeocodeOptions) =>
      client.places.reverseGeocode(location, options),
    [client]
  );
  return useAsyncRequest(request, {
    immediateArgs: initialArgs,
  } satisfies AsyncRequestOptions<UseReverseGeocodeArgs>);
}

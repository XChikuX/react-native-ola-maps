import { useCallback } from 'react';
import { useIndiaMaps } from './useIndiaMaps';
import { useAsyncRequest } from './useAsyncRequest';
import type { AsyncRequestOptions } from './useAsyncRequest';
import type { DirectionsOptions } from '../types/routing';
import type { LatLngInput } from '../types/common';

/** Arguments for the automatic request: `[origin, destination, options?]`. */
export type UseDirectionsArgs = [
  origin: LatLngInput,
  destination: LatLngInput,
  options?: DirectionsOptions,
];

/**
 * Directions request state backed by {@linkcode RoutingApi.getDirections}.
 *
 * @example
 * const { data, execute, loading } = useDirections();
 * await execute('12.9716,77.5946', '12.9352,77.6245', { mode: 'driving' });
 */
export function useDirections(initialArgs?: UseDirectionsArgs) {
  const client = useIndiaMaps();
  const request = useCallback(
    (
      origin: LatLngInput,
      destination: LatLngInput,
      options?: DirectionsOptions
    ) => client.routing.getDirections(origin, destination, options),
    [client]
  );
  return useAsyncRequest(request, {
    immediateArgs: initialArgs,
  } satisfies AsyncRequestOptions<UseDirectionsArgs>);
}

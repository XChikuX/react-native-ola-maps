import { useCallback } from 'react';
import { useIndiaMaps } from './useIndiaMaps';
import { useAsyncRequest } from './useAsyncRequest';
import type { LatLngString } from '../types/common';
import type { DirectionsOptions } from '../types/routing';

export function useDirections(
  initialArgs?: [LatLngString, LatLngString, DirectionsOptions?]
) {
  const client = useIndiaMaps();
  const request = useCallback(
    (
      origin: LatLngString,
      destination: LatLngString,
      options?: DirectionsOptions
    ) => client.routing.getDirections(origin, destination, options),
    [client]
  );
  return useAsyncRequest(request, { immediateArgs: initialArgs });
}

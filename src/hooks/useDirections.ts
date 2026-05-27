import { useCallback } from 'react';
import { useOlaMaps } from './useOlaMaps';
import { useAsyncRequest } from './useAsyncRequest';
import type { LatLngString } from '../types/common';
import type { DirectionsOptions } from '../types/routing';

export function useDirections(
  initialArgs?: [LatLngString, LatLngString, DirectionsOptions?]
) {
  const client = useOlaMaps();
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

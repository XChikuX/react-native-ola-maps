import { useIndiaMaps } from './useIndiaMaps';

/**
 * Returns the shared {@linkcode GeofencingApi} from the enclosing
 * {@linkcode IndiaMapsProvider}.
 */
export function useGeofencing() {
  return useIndiaMaps().geofencing;
}

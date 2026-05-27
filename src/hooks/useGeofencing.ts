import { useIndiaMaps } from './useIndiaMaps';

export function useGeofencing() {
  return useIndiaMaps().geofencing;
}

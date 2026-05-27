import { useOlaMaps } from './useOlaMaps';

export function useGeofencing() {
  return useOlaMaps().geofencing;
}

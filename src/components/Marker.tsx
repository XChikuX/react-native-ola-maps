import {
  Marker as MapLibreMarker,
  type MarkerProps as MapLibreMarkerProps,
} from '@maplibre/maplibre-react-native';
import type { LatLng, LatLngLiteral, LngLat } from '../types/common';
import { toLngLat } from '../types/common';

export type MarkerProps = Omit<MapLibreMarkerProps, 'lngLat'> & {
  coordinate: LatLng | LatLngLiteral | LngLat;
};

export function Marker({ coordinate, ...props }: MarkerProps) {
  const lngLat = Array.isArray(coordinate) ? coordinate : toLngLat(coordinate);
  return <MapLibreMarker lngLat={lngLat} {...props} />;
}

import { Marker as MapLibreMarker } from '@maplibre/maplibre-react-native';
import type { LatLng, LatLngLiteral, LngLat } from '../types/common';
import { toLngLat } from '../types/common';

export type MarkerProps = {
  id?: string;
  coordinate: LatLng | LatLngLiteral | LngLat;
  children?: unknown;
} & Record<string, unknown>;

export function Marker({
  id = 'india-marker',
  coordinate,
  children,
  ...props
}: MarkerProps) {
  const lngLat = Array.isArray(coordinate) ? coordinate : toLngLat(coordinate);
  return (
    <MapLibreMarker id={id} lngLat={lngLat} {...props}>
      {(children as any) ?? <></>}
    </MapLibreMarker>
  );
}

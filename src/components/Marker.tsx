import type { ComponentType } from 'react';
import { loadMapplsMapSdk } from '../mappls/loaders';
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
  ...props
}: MarkerProps) {
  const sdk = loadMapplsMapSdk() as {
    PointAnnotation: ComponentType<Record<string, unknown>>;
  };
  const PointAnnotation = sdk.PointAnnotation;
  const lngLat = Array.isArray(coordinate) ? coordinate : toLngLat(coordinate);
  return <PointAnnotation id={id} coordinate={lngLat} {...props} />;
}

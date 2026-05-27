import type { ComponentType } from 'react';
import { useMemo } from 'react';
import { loadMapplsMapSdk } from '../mappls/loaders';
import type { LatLng, LatLngLiteral, LngLat } from '../types/common';
import { toLngLat } from '../types/common';

export type PolylineProps = {
  id?: string;
  coordinates: Array<LatLng | LatLngLiteral | LngLat>;
  color?: string;
  width?: number;
  opacity?: number;
  layerProps?: Record<string, unknown>;
};

export function Polyline({
  id = 'india-polyline',
  coordinates,
  color = '#2563eb',
  width = 4,
  opacity = 1,
  layerProps,
}: PolylineProps) {
  const sdk = loadMapplsMapSdk() as {
    ShapeSource: ComponentType<Record<string, unknown>>;
    LineLayer: ComponentType<Record<string, unknown>>;
  };
  const ShapeSource = sdk.ShapeSource;
  const LineLayer = sdk.LineLayer;
  const feature = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates.map((coordinate) =>
          Array.isArray(coordinate) ? coordinate : toLngLat(coordinate)
        ),
      },
    }),
    [coordinates]
  );

  return (
    <ShapeSource id={`${id}-source`} shape={feature}>
      <LineLayer
        id={id}
        style={{ lineColor: color, lineWidth: width, lineOpacity: opacity }}
        {...layerProps}
      />
    </ShapeSource>
  );
}

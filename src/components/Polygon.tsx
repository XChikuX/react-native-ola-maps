import type { ComponentType } from 'react';
import { useMemo } from 'react';
import { loadMapplsMapSdk } from '../mappls/loaders';
import type { LatLng, LatLngLiteral, LngLat } from '../types/common';
import { toLngLat } from '../types/common';

export type PolygonProps = {
  id?: string;
  coordinates: Array<LatLng | LatLngLiteral | LngLat>;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillLayerProps?: Record<string, unknown>;
  lineLayerProps?: Record<string, unknown>;
};

const closeRing = (coordinates: LngLat[]): LngLat[] => {
  if (coordinates.length === 0) {
    return coordinates;
  }
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first?.[0] === last?.[0] && first?.[1] === last?.[1]) {
    return coordinates;
  }
  return [...coordinates, first as LngLat];
};

export function Polygon({
  id = 'india-polygon',
  coordinates,
  fillColor = '#2563eb',
  fillOpacity = 0.25,
  strokeColor = '#2563eb',
  strokeWidth = 2,
  fillLayerProps,
  lineLayerProps,
}: PolygonProps) {
  const sdk = loadMapplsMapSdk() as {
    ShapeSource: ComponentType<Record<string, unknown>>;
    FillLayer: ComponentType<Record<string, unknown>>;
    LineLayer: ComponentType<Record<string, unknown>>;
  };
  const ShapeSource = sdk.ShapeSource;
  const FillLayer = sdk.FillLayer;
  const LineLayer = sdk.LineLayer;
  const ring = useMemo(
    () =>
      closeRing(
        coordinates.map((coordinate) =>
          Array.isArray(coordinate) ? coordinate : toLngLat(coordinate)
        )
      ),
    [coordinates]
  );

  const feature = useMemo<GeoJSON.Feature<GeoJSON.Polygon>>(
    () => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
    }),
    [ring]
  );

  return (
    <ShapeSource id={`${id}-source`} shape={feature}>
      <FillLayer
        id={`${id}-fill`}
        style={{ fillColor, fillOpacity }}
        {...fillLayerProps}
      />
      <LineLayer
        id={`${id}-stroke`}
        style={{ lineColor: strokeColor, lineWidth: strokeWidth }}
        {...lineLayerProps}
      />
    </ShapeSource>
  );
}

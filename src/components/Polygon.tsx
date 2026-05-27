import { useMemo } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
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
  id = 'ola-polygon',
  coordinates,
  fillColor = '#2563eb',
  fillOpacity = 0.25,
  strokeColor = '#2563eb',
  strokeWidth = 2,
  fillLayerProps,
  lineLayerProps,
}: PolygonProps) {
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
    <GeoJSONSource id={`${id}-source`} data={feature}>
      <Layer
        id={`${id}-fill`}
        type="fill"
        source={`${id}-source`}
        paint={{ 'fill-color': fillColor, 'fill-opacity': fillOpacity }}
        {...(fillLayerProps as object)}
      />
      <Layer
        id={`${id}-stroke`}
        type="line"
        source={`${id}-source`}
        paint={{ 'line-color': strokeColor, 'line-width': strokeWidth }}
        {...(lineLayerProps as object)}
      />
    </GeoJSONSource>
  );
}

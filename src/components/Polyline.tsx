import { useMemo } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
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
  id = 'ola-polyline',
  coordinates,
  color = '#2563eb',
  width = 4,
  opacity = 1,
  layerProps,
}: PolylineProps) {
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
    <GeoJSONSource id={`${id}-source`} data={feature}>
      <Layer
        id={id}
        type="line"
        source={`${id}-source`}
        paint={{
          'line-color': color,
          'line-width': width,
          'line-opacity': opacity,
        }}
        {...(layerProps as object)}
      />
    </GeoJSONSource>
  );
}

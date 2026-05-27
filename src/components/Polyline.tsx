import { useMemo } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
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
    <MapLibreGL.ShapeSource id={`${id}-source`} shape={feature}>
      <MapLibreGL.LineLayer
        id={id}
        style={{ lineColor: color, lineWidth: width, lineOpacity: opacity }}
        {...layerProps}
      />
    </MapLibreGL.ShapeSource>
  );
}

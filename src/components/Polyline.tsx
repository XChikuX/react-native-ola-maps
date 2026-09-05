import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { LatLngInput } from '../types/common';
import { toLngLat } from '../utils/coordinates';

type LayerProps = ComponentProps<typeof Layer>;

/** Style-spec line-layer props (the `paint`/`layout` variant, not legacy `style`). */
type LineLayerSpec = Extract<
  Extract<LayerProps, { style?: never }>,
  { type: 'line' }
>;

/** Props for {@linkcode Polyline}. */
export type PolylineProps = {
  /** Layer identifier. @default 'india-polyline' */
  id?: string;

  /** Line vertices in any accepted coordinate format. */
  coordinates: LatLngInput[];

  /** Line color. @default '#2563eb' */
  color?: string;

  /** Line width in points. @default 4 */
  width?: number;

  /** Line opacity between 0 and 1. @default 1 */
  opacity?: number;

  /** Extra props merged onto the underlying MapLibre line layer. */
  layerProps?: Omit<LineLayerSpec, 'id' | 'type' | 'source'>;
};

/**
 * Polyline overlay rendered through a GeoJSON source and line layer.
 *
 * @example
 * <Polyline id="route" coordinates={[[77.59, 12.97], [77.6, 12.98]]} />
 */
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
        coordinates: coordinates.map(toLngLat),
      },
    }),
    [coordinates]
  );

  return (
    <GeoJSONSource id={`${id}-source`} data={feature}>
      <Layer
        id={id}
        type="line"
        paint={{
          'line-color': color,
          'line-width': width,
          'line-opacity': opacity,
        }}
        {...layerProps}
      />
    </GeoJSONSource>
  );
}

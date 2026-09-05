import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import { GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import type { LatLngInput, LngLat } from '../types/common';
import { toLngLat } from '../utils/coordinates';

type LayerProps = ComponentProps<typeof Layer>;

/** Style-spec layer props (the `paint`/`layout` variant, not legacy `style`). */
type StyleSpecLayerProps = Extract<LayerProps, { style?: never }>;
type FillLayerSpec = Extract<StyleSpecLayerProps, { type: 'fill' }>;
type LineLayerSpec = Extract<StyleSpecLayerProps, { type: 'line' }>;

/** Props for {@linkcode Polygon}. */
export type PolygonProps = {
  /** Layer identifier. @default 'india-polygon' */
  id?: string;

  /** Ring vertices in any accepted coordinate format; closed automatically. */
  coordinates: LatLngInput[];

  /** Fill color. @default '#2563eb' */
  fillColor?: string;

  /** Fill opacity between 0 and 1. @default 0.25 */
  fillOpacity?: number;

  /** Stroke color. @default '#2563eb' */
  strokeColor?: string;

  /** Stroke width in points. @default 2 */
  strokeWidth?: number;

  /** Extra props merged onto the underlying MapLibre fill layer. */
  fillLayerProps?: Omit<FillLayerSpec, 'id' | 'type' | 'source'>;

  /** Extra props merged onto the underlying MapLibre line layer. */
  lineLayerProps?: Omit<LineLayerSpec, 'id' | 'type' | 'source'>;
};

/** Closes the ring so the first and last vertices match, as GeoJSON requires. */
const closeRing = (coordinates: LngLat[]): LngLat[] => {
  if (coordinates.length === 0) {
    return coordinates;
  }
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first && last && first[0] === last[0] && first[1] === last[1]) {
    return coordinates;
  }
  return [...coordinates, first as LngLat];
};

/**
 * Filled, stroked polygon overlay rendered through a GeoJSON source.
 *
 * @example
 * <Polygon id="area" coordinates={[[77.59, 12.97], [77.6, 12.98], [77.59, 12.98]]} />
 */
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
  const ring = useMemo(
    () => closeRing(coordinates.map(toLngLat)),
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
        paint={{ 'fill-color': fillColor, 'fill-opacity': fillOpacity }}
        {...fillLayerProps}
      />
      <Layer
        id={`${id}-stroke`}
        type="line"
        paint={{ 'line-color': strokeColor, 'line-width': strokeWidth }}
        {...lineLayerProps}
      />
    </GeoJSONSource>
  );
}

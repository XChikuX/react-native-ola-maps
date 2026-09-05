import { forwardRef } from 'react';
import type { ComponentProps, ComponentRef, ReactNode } from 'react';
import { View } from 'react-native';
import { Marker as MapLibreMarker } from '@maplibre/maplibre-react-native';
import type { LatLngInput } from '../types/common';
import { toLngLat } from '../utils/coordinates';

type MapLibreMarkerProps = ComponentProps<typeof MapLibreMarker>;
type MapLibreMarkerRef = ComponentRef<typeof MapLibreMarker>;

/**
 * Props for {@linkcode Marker}: MapLibre marker props with `lngLat` replaced
 * by the more convenient `coordinate` input.
 */
export type MarkerProps = Omit<MapLibreMarkerProps, 'lngLat' | 'children'> & {
  /** Marker identifier. @default 'india-marker' */
  id?: string;

  /** Marker position in any accepted coordinate format. */
  coordinate: LatLngInput;

  /** Marker content rendered as an annotation view. */
  children?: ReactNode;
};

/**
 * Map marker backed by MapLibre, accepting any coordinate format.
 *
 * @example
 * <Marker id="delhi" coordinate={{ latitude: 28.6139, longitude: 77.209 }} />
 */
export const Marker = forwardRef<MapLibreMarkerRef, MarkerProps>(
  ({ id = 'india-marker', coordinate, children, ...props }, ref) => (
    <MapLibreMarker ref={ref} id={id} lngLat={toLngLat(coordinate)} {...props}>
      <>{children ?? <View />}</>
    </MapLibreMarker>
  )
);

Marker.displayName = 'Marker';

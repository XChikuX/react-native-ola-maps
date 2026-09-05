import type { ComponentProps } from 'react';
import {
  NativeUserLocation as MapLibreNativeUserLocation,
  UserLocation as MapLibreUserLocation,
} from '@maplibre/maplibre-react-native';

/** Props for {@linkcode UserLocation}, passthrough to the MapLibre component. */
export type UserLocationProps = ComponentProps<typeof MapLibreUserLocation>;

/** Props for {@linkcode NativeUserLocation}, passthrough to MapLibre. */
export type NativeUserLocationProps = ComponentProps<
  typeof MapLibreNativeUserLocation
>;

/** Renders the device location puck, backed by MapLibre. */
export function UserLocation(props: UserLocationProps) {
  return <MapLibreUserLocation {...props} />;
}

/** Renders the platform-native location indicator, backed by MapLibre. */
export function NativeUserLocation(props: NativeUserLocationProps) {
  return <MapLibreNativeUserLocation {...props} />;
}

export type { GeolocationPosition } from '@maplibre/maplibre-react-native';

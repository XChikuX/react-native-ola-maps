import {
  NativeUserLocation as MapLibreNativeUserLocation,
  UserLocation as MapLibreUserLocation,
  type GeolocationPosition,
} from '@maplibre/maplibre-react-native';

export function UserLocation(props: Record<string, unknown>) {
  return <MapLibreUserLocation {...props} />;
}

export function NativeUserLocation(props: Record<string, unknown>) {
  return <MapLibreNativeUserLocation {...props} />;
}

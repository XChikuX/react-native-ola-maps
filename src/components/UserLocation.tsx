import MapLibreGL from '@maplibre/maplibre-react-native';

export type GeolocationPosition = Record<string, unknown>;

export function UserLocation(props: Record<string, unknown>) {
  return <MapLibreGL.UserLocation {...props} />;
}

export function NativeUserLocation(props: Record<string, unknown>) {
  return <UserLocation {...props} />;
}

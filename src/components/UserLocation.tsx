import { loadMapplsMapSdk } from '../mappls/loaders';

export type GeolocationPosition = Record<string, unknown>;

export function UserLocation(props: Record<string, unknown>) {
  const sdk = loadMapplsMapSdk() as {
    UserLocation: React.ComponentType<Record<string, unknown>>;
  };
  const UserLocationComponent = sdk.UserLocation;
  return <UserLocationComponent {...props} />;
}

export function NativeUserLocation(props: Record<string, unknown>) {
  return <UserLocation {...props} />;
}

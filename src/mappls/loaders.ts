import { IndiaMapsError } from '../errors';

declare const require: (moduleName: string) => unknown;

type OptionalModule = Record<string, unknown>;

const loadModule = (moduleName: string, reason: string): OptionalModule => {
  try {
    return require(moduleName) as OptionalModule;
  } catch (error) {
    throw new IndiaMapsError(reason, 'CONFIGURATION_ERROR', {
      response: error,
    });
  }
};

export const loadMapplsMapSdk = () =>
  loadModule(
    'mappls-map-react-native',
    'mappls-map-react-native is required. Install it with bun add mappls-map-react-native and configure the native SDK or Expo config plugin.'
  );

export const loadMapplsDirectionWidget = () =>
  loadModule(
    'mappls-direction-widget-react-native',
    'mappls-direction-widget-react-native is not installed. Install it with bun add mappls-direction-widget-react-native.'
  );

export const loadMapplsGeofenceWidget = () =>
  loadModule(
    'mappls-geofence-widget-react-native',
    'mappls-geofence-widget-react-native is not installed. Install it with bun add mappls-geofence-widget-react-native.'
  );

export const loadMapplsNearbyWidget = () =>
  loadModule(
    'mappls-nearby-widget-react-native',
    'mappls-nearby-widget-react-native is not installed. Install it with bun add mappls-nearby-widget-react-native.'
  );

export const loadMapplsSearchWidgets = () =>
  loadModule(
    'mappls-search-widgets-react-native',
    'mappls-search-widgets-react-native is not installed. Install it with bun add mappls-search-widgets-react-native.'
  );

export const loadMapplsTrackingSdk = () =>
  loadModule(
    'mappls-tracking-react-native',
    'mappls-tracking-react-native is not installed. Install it with bun add mappls-tracking-react-native.'
  );

export const loadMapplsPolyline = () =>
  loadModule(
    'mappls-polyline',
    'mappls-polyline is not installed. Install it with bun add mappls-polyline.'
  );

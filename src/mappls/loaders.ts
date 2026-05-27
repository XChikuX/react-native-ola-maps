/**
 * @deprecated MapLibre loaders are no longer needed.
 * This module is kept for backward compatibility but all functions are no-ops.
 * Map rendering is now handled directly by @maplibre/maplibre-react-native.
 */

const deprecatedLoader = (name: string) => () => {
  console.warn(
    `[react-native-india-maps] ${name}() is deprecated. Map rendering now uses @maplibre/maplibre-react-native directly.`
  );
  return {};
};

/** @deprecated Use MapView from this package directly */
export const loadMapplsMapSdk = deprecatedLoader('loadMapplsMapSdk');
/** @deprecated No longer supported */
export const loadMapplsDirectionWidget = deprecatedLoader(
  'loadMapplsDirectionWidget'
);
/** @deprecated No longer supported */
export const loadMapplsGeofenceWidget = deprecatedLoader(
  'loadMapplsGeofenceWidget'
);
/** @deprecated No longer supported */
export const loadMapplsNearbyWidget = deprecatedLoader(
  'loadMapplsNearbyWidget'
);
/** @deprecated No longer supported */
export const loadMapplsSearchWidgets = deprecatedLoader(
  'loadMapplsSearchWidgets'
);
/** @deprecated No longer supported */
export const loadMapplsTrackingSdk = deprecatedLoader('loadMapplsTrackingSdk');
/** @deprecated No longer supported */
export const loadMapplsPolyline = deprecatedLoader('loadMapplsPolyline');

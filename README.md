# react-native-india-maps

A React Native SDK for India Maps built around the official Mappls (MapMyIndia) SDK, official Mappls REST APIs, and Expo config plugins.

## What changed

- Package name is now `react-native-india-maps`
- Native map rendering now uses the official `mappls-map-react-native` SDK
- Expo development builds are supported through a config plugin in this package
- Mappls styles cannot be rendered directly through `@maplibre/maplibre-react-native` because Mappls does not publish public MapLibre style URLs

## Install

```sh
bun add react-native-india-maps mappls-map-react-native
```

If you also need official Mappls widgets, install the ones you use:

```sh
bun add mappls-direction-widget-react-native mappls-geofence-widget-react-native mappls-nearby-widget-react-native mappls-search-widgets-react-native mappls-tracking-react-native mappls-polyline
```

## Expo setup

Use an Expo development build, not Expo Go.

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-india-maps",
        {
          "androidConfigFilesDir": "./mappls/android",
          "iosConfigFilesDir": "./mappls/ios",
          "iosWhenInUsePermission": "Allow $(PRODUCT_NAME) to access your location while using the app.",
          "backgroundLocation": false
        }
      ]
    ]
  }
}
```

The plugin adds location permissions and automates the main native setup required by the official Mappls SDK. Your app must still provide the real `.conf` and `.olf` files downloaded from the Mappls auth console.

## Provider and hooks

```tsx
import {
  IndiaMapsProvider,
  IndiaMapsClient,
  MapView,
  Marker,
  useAutocomplete,
} from 'react-native-india-maps';

const client = new IndiaMapsClient({ accessToken: 'YOUR_MAPPLS_REST_TOKEN' });

function SearchBox() {
  const { results, debouncedSearch } = useAutocomplete({ debounceMs: 300 });
  return null;
}

export function App() {
  return (
    <IndiaMapsProvider client={client}>
      <MapView
        style={{ flex: 1 }}
        styleName="standard"
        initialRegion={{ latitude: 28.6139, longitude: 77.209, zoomLevel: 12 }}
      >
        <Marker
          id="delhi"
          coordinate={{ latitude: 28.6139, longitude: 77.209 }}
        />
      </MapView>
      <SearchBox />
    </IndiaMapsProvider>
  );
}
```

## Official SDK access

This package exposes loaders for the official Mappls packages instead of guessing their public component shapes:

- `loadMapplsMapSdk()`
- `loadMapplsDirectionWidget()`
- `loadMapplsGeofenceWidget()`
- `loadMapplsNearbyWidget()`
- `loadMapplsSearchWidgets()`
- `loadMapplsTrackingSdk()`
- `loadMapplsPolyline()`

You can also access them from `client.sdk`.

## API coverage

### Native Mappls SDK-backed

- Auto suggest
- Geocode
- Reverse geocode
- Place detail
- Nearby search
- Directions
- Distance matrix
- POI along route
- Official native map rendering and widgets

### Direct HTTP integrations for public APIs not exposed by the RN SDK

- Elevation: `https://sdk.mappls.com/map/utils/elevation`
- Route optimization: `https://route.mappls.com/route/optimization/...`
- Snap to road v2: `https://route.mappls.com/routev2/movement/trace_route`
- Still map images: `https://tile.mappls.com/map/raster_tile/still_image`

## Notes

- `accessToken` is used for direct REST calls in this package
- The native Mappls SDK itself authenticates with platform-specific `.conf` and `.olf` files
- Legacy `OlaMapsClient`, `OlaMapsProvider`, and `useOlaMaps` aliases are still exported for compatibility

## License

LGPL-3.0-or-later. See [LICENSE.txt](./LICENSE.txt).

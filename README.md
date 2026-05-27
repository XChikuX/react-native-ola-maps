# react-native-india-maps

A React Native SDK for India Maps powered by **MapLibre** for rendering and supporting both **Ola Maps** and **Mappls** API backends.

## Features

- 🗺️ Map rendering via `@maplibre/maplibre-react-native` (no proprietary native SDKs)
- 🔄 Dual-provider: Ola Maps (default) and Mappls backends
- 📍 Full Places API (autocomplete, geocode, reverse geocode, nearby, text search)
- 🛣️ Routing API (directions, distance matrix, route optimizer)
- 🛤️ Roads API (snap to road, nearest roads, speed limits)
- 🏔️ Elevation API
- 📐 Geofencing API (Ola Maps only)
- 🎨 Multiple map styles (light, dark, satellite, and more)
- ⚡ Expo config plugin for location permissions

## Install

```sh
bun add react-native-india-maps @maplibre/maplibre-react-native
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
          "iosWhenInUsePermission": "Allow $(PRODUCT_NAME) to access your location while using the app.",
          "backgroundLocation": false
        }
      ]
    ]
  }
}
```

The plugin adds location permissions for both Android and iOS. No native SDK configuration files are needed — MapLibre handles all map rendering.

## Provider and hooks

```tsx
import {
  IndiaMapsProvider,
  IndiaMapsClient,
  MapView,
  Marker,
  useAutocomplete,
} from 'react-native-india-maps';

// Ola Maps (default provider)
const client = new IndiaMapsClient({ apiKey: 'YOUR_OLA_MAPS_API_KEY' });

// Or Mappls provider
// const client = new IndiaMapsClient({ accessToken: 'YOUR_MAPPLS_TOKEN', provider: 'mappls' });

function SearchBox() {
  const { results, debouncedSearch } = useAutocomplete({ debounceMs: 300 });
  return null;
}

export function App() {
  return (
    <IndiaMapsProvider client={client}>
      <MapView
        style={{ flex: 1 }}
        styleName="default-light-standard"
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

## Dual-provider support

The SDK supports two backends:

| Feature | Ola Maps | Mappls |
| --- | --- | --- |
| Auth param | `api_key` | `access_token` |
| Base URL | `https://api.olamaps.io` | `https://atlas.mappls.com` |
| Map tiles | ✅ Vector tiles | ❌ Not public |
| Geofencing | ✅ | ❌ Not public |

```ts
// Ola Maps (default)
const olaClient = new IndiaMapsClient({ apiKey: 'YOUR_KEY' });

// Mappls
const mapplsClient = new IndiaMapsClient({
  accessToken: 'YOUR_TOKEN',
  provider: 'mappls',
});
```

## API coverage

### Places

- Autocomplete / Autosuggest
- Geocode
- Reverse Geocode
- Place Details
- Nearby Search
- Text Search

### Routing

- Directions (driving, walking, biking)
- Distance Matrix
- Route Optimizer

### Roads

- Snap to Road
- Nearest Roads
- Speed Limits

### Elevation

- Single point elevation
- Multi-point elevation

### Geofencing (Ola Maps only)

- Create / Read / Update / Delete geofences
- Check point status (inside/outside)

### Tiles

- Vector tile style URLs for MapLibre
- Static map image URLs
- Request transform helper for API key injection

## Map styles

Available Ola Maps styles: `default-light-standard`, `default-dark-standard`, `default-light-lite`, `default-dark-lite`, `default-light-full`, `default-dark-full`, `eclipse-light-standard`, `eclipse-dark-standard`, `bolt-light`, `bolt-dark`, `vintage-light`, `vintage-dark`, and more.

## Notes

- `apiKey` is used for Ola Maps API authentication
- `accessToken` is used for Mappls API authentication
- Legacy `OlaMapsClient`, `OlaMapsProvider`, and `useOlaMaps` aliases are exported for compatibility

## License

LGPL-3.0-or-later. See [LICENSE.txt](./LICENSE.txt).

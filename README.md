# react-native-ola-maps

A modern React Native SDK for Ola Maps with:

- A typed REST API client for Places, Routing, Roads, Geofencing, Elevation, and Tiles
- React context provider and hooks for API-driven flows
- MapLibre React Native v11 map components for maps, markers, polylines, polygons, callouts, and user location

## Installation

```sh
npm install react-native-ola-maps @maplibre/maplibre-react-native
```

Map components use `@maplibre/maplibre-react-native` v11, which requires React Native New Architecture, React `>=19.1.0`, and React Native `>=0.80.0`.

## API client

```ts
import { OlaMapsClient } from 'react-native-ola-maps';

const ola = new OlaMapsClient({ apiKey: 'YOUR_OLA_MAPS_API_KEY' });

const suggestions = await ola.places.autocomplete('Koramangala');
const route = await ola.routing.getDirections(
  '12.9352,77.6245',
  '12.9716,77.5946'
);
const styleUrl = ola.tiles.getStyleURL('default-light-standard');
```

## React provider and hooks

```tsx
import { OlaMapsProvider, useAutocomplete } from 'react-native-ola-maps';

function SearchBox() {
  const { results, debouncedSearch } = useAutocomplete({ debounceMs: 300 });
  // call debouncedSearch(text) from your TextInput
  return null;
}

export function App() {
  return (
    <OlaMapsProvider apiKey="YOUR_OLA_MAPS_API_KEY">
      <SearchBox />
    </OlaMapsProvider>
  );
}
```

## Map components

```tsx
import { MapView, Marker, Polyline, Polygon } from 'react-native-ola-maps';

<MapView
  apiKey="YOUR_OLA_MAPS_API_KEY"
  styleName="default-light-standard"
  initialRegion={{ latitude: 12.9716, longitude: 77.5946, zoomLevel: 12 }}
>
  <Marker coordinate={{ latitude: 12.9716, longitude: 77.5946 }}>
    <YourMarkerView />
  </Marker>
  <Polyline
    coordinates={[
      [77.5946, 12.9716],
      [77.6245, 12.9352],
    ]}
  />
  <Polygon
    coordinates={[
      [77.59, 12.97],
      [77.62, 12.97],
      [77.62, 12.93],
    ]}
  />
</MapView>;
```

## API surface

- `places`: autocomplete, geocode, reverse geocode, place details, nearby search, text search, address validation, photo
- `routing`: directions, basic directions, distance matrix, basic matrix, route optimizer, fleet planner
- `roads`: snap to road, nearest roads, speed limits
- `geofencing`: create, get, update, delete, list, check status
- `elevation`: single and multi-point elevation
- `tiles`: style URLs, static map URLs, vector tile helpers, MapLibre map options

## License

LGPL-3.0-or-later. See [LICENSE.txt](./LICENSE.txt).

# `<MapView />` Component API

`MapView` wraps the MapLibre v11 `Map` component with Ola Maps vector tile styles.

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `accessToken` | `string` | Mappls access token (if using Mappls provider). |
| `apiKey` | `string` | Ola Maps API key (default provider). |
| `client` | `IndiaMapsClient` | Optional preconfigured client. |
| `styleName` | `MapStyle` | Ola Maps style name (e.g. `default-light-standard`). |
| `initialRegion` | `InitialRegion` | `{ latitude, longitude, zoomLevel }`. |
| `initialCenter` | `[lng, lat]` | Initial center coordinate (GeoJSON order). |
| `initialZoom` | `number` | Initial zoom level. |
| `cameraProps` | `object` | Passed to MapLibre `Camera` component. |
| `style` | `object` | React Native view style. |
| `onMapReady` | `() => void` | Called when map finishes loading. |
| `onRegionDidChange` | `(event) => void` | Called when the visible region changes. |

## Example

```tsx
import { MapView, Marker, Polyline } from 'react-native-india-maps';

<MapView
  style={{ flex: 1 }}
  styleName="default-light-standard"
  initialRegion={{ latitude: 28.6139, longitude: 77.209, zoomLevel: 12 }}
>
  <Marker id="delhi" coordinate={{ latitude: 28.6139, longitude: 77.209 }} />
  <Polyline
    id="route"
    coordinates={[
      [77.209, 28.6139],
      [77.22, 28.62],
    ]}
    color="#007AFF"
    width={3}
  />
</MapView>
```

## How it works

- The `MapView` component uses `@maplibre/maplibre-react-native` v11 for rendering
- Style URLs are constructed from Ola Maps tile endpoints: `https://api.olamaps.io/tiles/vector/v1/styles/{styleName}/style.json`
- The API key is injected via the style URL query parameter
- React Native New Architecture is required by MapLibre v11
- No proprietary native SDKs are required

## Available styles

See `MapStyle` type for all options. Common ones:

- `default-light-standard` — Light theme, standard detail
- `default-dark-standard` — Dark theme, standard detail
- `default-light-lite` — Light theme, minimal detail
- `default-dark-lite` — Dark theme, minimal detail
- `default-light-full` — Light theme, full detail
- `eclipse-light-standard` — Eclipse theme, light
- `eclipse-dark-standard` — Eclipse theme, dark
- `bolt-light` — Bolt theme, light
- `bolt-dark` — Bolt theme, dark

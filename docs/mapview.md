# `<MapView />` Component API

`MapView` wraps the official `mappls-map-react-native` `MapView` component.

## Props

| Prop            | Type              | Notes                                             |
| --------------- | ----------------- | ------------------------------------------------- |
| `accessToken`   | `string`          | Optional REST token for this package's HTTP APIs. |
| `apiKey`        | `string`          | Alias for `accessToken`.                          |
| `client`        | `IndiaMapsClient` | Optional preconfigured client.                    |
| `styleName`     | `string`          | Native Mappls style name.                         |
| `initialRegion` | `InitialRegion`   | `{ latitude, longitude, zoomLevel }`.             |
| `initialCenter` | `[lng, lat]`      | Initial center coordinate.                        |
| `initialZoom`   | `number`          | Initial zoom level.                               |
| `cameraProps`   | `object`          | Passed to the native Mappls `Camera`.             |

## Example

```tsx
<MapView
  style={{ flex: 1 }}
  styleName="standard"
  initialRegion={{ latitude: 28.6139, longitude: 77.209, zoomLevel: 12 }}
/>
```

## Important

Mappls does not publish public MapLibre style URLs, so this package uses the official native SDK for map rendering instead of `@maplibre/maplibre-react-native`.

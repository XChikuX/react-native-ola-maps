# `<MapView />` Component API

`MapView` wraps `@maplibre/maplibre-react-native` v11's `Map` component and configures Ola Maps vector style URLs.

## Props

| Prop            | Type            | Notes                                       |
| --------------- | --------------- | ------------------------------------------- |
| `apiKey`        | `string`        | Ola Maps API key. Optional inside provider. |
| `client`        | `OlaMapsClient` | Optional preconfigured client.              |
| `styleName`     | `MapStyle`      | Ola style name. Defaults to light standard. |
| `mapStyle`      | `string/object` | Override with a MapLibre style URL or JSON. |
| `initialRegion` | `InitialRegion` | `{ latitude, longitude, zoomLevel }`.       |
| `initialCenter` | `[lng, lat]`    | MapLibre-style initial center.              |
| `initialZoom`   | `number`        | Initial zoom.                               |
| `cameraProps`   | `CameraProps`   | Extra MapLibre Camera props.                |

All other MapLibre v11 `MapProps` pass through to the underlying map.

## Example

```tsx
<MapView
  apiKey="YOUR_OLA_MAPS_API_KEY"
  styleName="default-light-standard"
  initialRegion={{ latitude: 12.9716, longitude: 77.5946, zoomLevel: 12 }}
/>
```

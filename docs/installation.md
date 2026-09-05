# Installation

```sh
bun add react-native-india-maps @maplibre/maplibre-react-native@^11.0.0
```

## Requirements

- React `>=19.2.0`
- React Native `>=0.83.0`
- `@maplibre/maplibre-react-native` `>=11.0.0`
- Expo SDK 55+ development build or bare React Native app
- React Native New Architecture enabled
- Ola Maps API key or Mappls access token

## Expo plugin

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

The plugin handles:
- Android: `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` permissions (+ `ACCESS_BACKGROUND_LOCATION` if `backgroundLocation: true`)
- iOS: `NSLocationWhenInUseUsageDescription` (+ `NSLocationAlwaysAndWhenInUseUsageDescription` if `backgroundLocation: true`)

No native SDK configuration files, Maven repositories, or Gradle plugins are needed — MapLibre handles all rendering natively.

## Provider

```tsx
import { IndiaMapsProvider, IndiaMapsClient } from 'react-native-india-maps';

// Ola Maps (default)
const client = new IndiaMapsClient({ apiKey: 'YOUR_OLA_MAPS_API_KEY' });

// Or Mappls
// const client = new IndiaMapsClient({ accessToken: 'YOUR_MAPPLS_TOKEN', provider: 'mappls' });

<IndiaMapsProvider client={client}>
  <App />
</IndiaMapsProvider>;
```

## Important

- Expo Go is not supported — MapLibre requires native rendering
- MapLibre v11 only supports the React Native New Architecture
- No `.conf` or `.olf` files are needed (those were Mappls native SDK artifacts)
- The map rendering is fully handled by `@maplibre/maplibre-react-native`

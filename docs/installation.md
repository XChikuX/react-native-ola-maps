# Installation

```sh
bun add react-native-india-maps mappls-map-react-native
```

Optional official packages:

```sh
bun add mappls-direction-widget-react-native mappls-geofence-widget-react-native mappls-nearby-widget-react-native mappls-search-widgets-react-native mappls-tracking-react-native mappls-polyline
```

## Requirements

- React `>=19.1.0`
- React Native `>=0.80.0`
- Expo development build or bare React Native app
- Mappls auth files for native SDK usage
- Mappls REST access token for direct HTTP endpoints in this package

## Expo plugin

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

## Provider

```tsx
import { IndiaMapsProvider } from 'react-native-india-maps';

<IndiaMapsProvider accessToken="YOUR_MAPPLS_REST_TOKEN">
  <App />
</IndiaMapsProvider>;
```

## Important

`mappls-map-react-native` requires native Mappls configuration files. Expo Go is not supported.

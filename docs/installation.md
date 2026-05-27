# Installation

```sh
npm install react-native-ola-maps @maplibre/maplibre-react-native
```

Map components are powered by `@maplibre/maplibre-react-native` v11. Follow the MapLibre React Native installation steps for your app, including Expo config plugin setup if applicable.

## Requirements

- React `>=19.1.0`
- React Native `>=0.80.0`
- React Native New Architecture enabled
- Ola Maps API key

## API key

Pass your key to the client or provider:

```tsx
<OlaMapsProvider apiKey="YOUR_OLA_MAPS_API_KEY">
  <App />
</OlaMapsProvider>
```

No native Ola Maps SDK API key entries are required because this package uses Ola REST APIs and MapLibre rendering.

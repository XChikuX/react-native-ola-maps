# CLAUDE.md - Development Guidelines

## Project Overview

`react-native-india-maps` is a React Native SDK for India Maps built around the official Mappls (MapMyIndia) platform. It provides:

1. A React Native client surface for official Mappls REST APIs
2. Native map components backed by `mappls-map-react-native`
3. Expo config plugin support for native Mappls setup and location permissions
4. Loaders for the official Mappls widget and tracking packages

## Commands

```bash
# Install dependencies
bun install

# Build the library
bun run build

# Run tests
bun run test

# Lint
bun run lint

# Type check
bun run typecheck
```

## Architecture

- **`src/api/`** — SDK-backed and HTTP-backed Mappls API modules
- **`src/components/`** — React Native components wrapping `mappls-map-react-native`
- **`src/hooks/`** — React hooks for API access and state management
- **`src/providers/`** — React context providers for `IndiaMapsClient`
- **`src/mappls/`** — Lazy loaders for the official Mappls SDK packages
- **`plugin/`** — Expo config plugin for native setup and location permissions
- **`src/types/`** — Shared TypeScript types

## Conventions

- Use `bun` for dependency management and validation
- Prefer official Mappls SDK surfaces over undocumented HTTP reconstruction
- Use direct HTTP only for documented public endpoints not exposed by `mappls-map-react-native`
- Do not claim Mappls styles can be rendered directly through MapLibre style URLs
- Keep Expo support focused on development builds with config plugins, not Expo Go

## Key APIs

| Capability                                                      | Source                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------- |
| Autosuggest / Geocode / Reverse Geocode / Nearby / Place Detail | `mappls-map-react-native` `RestApi.*`                   |
| Directions / Distance Matrix / POI Along Route                  | `mappls-map-react-native` `RestApi.*`                   |
| Elevation                                                       | `https://sdk.mappls.com/map/utils/elevation`            |
| Route Optimization                                              | `https://route.mappls.com/route/optimization/...`       |
| Snap to Road v2                                                 | `https://route.mappls.com/routev2/movement/trace_route` |
| Still Map Image                                                 | `https://tile.mappls.com/map/raster_tile/still_image`   |

## Expo

- Expo Go is not supported because the official Mappls SDK requires native setup
- Use the package config plugin from `app.plugin.js`
- The config plugin manages location permissions and native setup hooks
- Real Mappls `.conf` and `.olf` files still have to be supplied by the app

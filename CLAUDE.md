# CLAUDE.md - Development Guidelines

## Project Overview

`react-native-india-maps` is a React Native SDK for India Maps that provides:

1. A dual-provider REST API client supporting both **Ola Maps** and **Mappls** backends
2. Native map components powered by `@maplibre/maplibre-react-native`
3. Expo config plugin for location permissions
4. Full TypeScript types for all API surfaces

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

- **`src/api/`** — HTTP-backed API modules (Places, Routing, Roads, Elevation, Geofencing, Tiles)
- **`src/components/`** — React Native components wrapping `@maplibre/maplibre-react-native`
- **`src/hooks/`** — React hooks for API access and state management
- **`src/providers/`** — React context providers for `IndiaMapsClient`
- **`src/types/`** — Shared TypeScript types and MapLibre type declarations
- **`plugin/`** — Expo config plugin for location permissions

## Conventions

- Use `bun` for dependency management and validation
- All API calls use direct HTTP via `fetch` — no native SDK bridge calls
- Dual-provider support: `provider: 'ola'` (default) or `provider: 'mappls'`
- Map rendering uses `@maplibre/maplibre-react-native` with Ola Maps vector tile styles
- Keep Expo support focused on development builds with config plugins, not Expo Go

## Providers

| Provider | Base URL | Auth Param | Notes |
| --- | --- | --- | --- |
| Ola Maps | `https://api.olamaps.io` | `api_key` | Default provider |
| Mappls | `https://atlas.mappls.com` / `https://apis.mappls.com` | `access_token` | Legacy support |

## Key APIs

| Capability | Ola Endpoint | Mappls Endpoint |
| --- | --- | --- |
| Autocomplete | `/places/v1/autocomplete` | `/api/places/search/json` |
| Geocode | `/places/v1/geocode` | `/api/places/geocode` |
| Reverse Geocode | `/places/v1/reverse-geocode` | `/api/places/geocode` |
| Directions | `/routing/v1/directions/{mode}` | `/advancedmaps/v1/{token}/direction` |
| Distance Matrix | `/routing/v1/distanceMatrix/{mode}` | `/advancedmaps/v1/{token}/distance_matrix/driving/...` |
| Snap to Road | `/routing/v1/snapToRoad` | `/advancedmaps/v1/{token}/snapToRoad` |
| Elevation | `/elevation/v1/getElevation` | N/A |
| Geofencing | `/geofencing/v1/fences` | N/A (not public) |
| Map Tiles | `/tiles/vector/v1/styles/{style}/style.json` | N/A |

## Expo

- Expo Go is not supported because MapLibre requires native rendering
- Use the package config plugin from `app.plugin.js`
- The config plugin manages location permissions (Android + iOS)
- No native SDK files or Maven repos needed — MapLibre handles rendering

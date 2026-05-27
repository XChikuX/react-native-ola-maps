# CLAUDE.md - Development Guidelines

## Project Overview

`react-native-ola-maps` is a React Native SDK for Ola Maps. It provides:

1. A TypeScript API client with full fidelity to `ola-map-sdk` npm package
2. React Native map components powered by `@maplibre/maplibre-react-native` v11
3. React hooks for common map operations

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

# Run example app
# Example app will be added in a later phase.
```

## Architecture

- **`src/api/`** — Pure TypeScript API modules (no React dependency). Each maps to an Ola Maps API domain (places, routing, roads, geofencing, elevation, tiles).
- **`src/components/`** — React Native components wrapping @maplibre/maplibre-react-native
- **`src/hooks/`** — React hooks for API access and state management
- **`src/providers/`** — React context providers (OlaMapsProvider injects API key)
- **`src/types/`** — TypeScript type definitions for all APIs

## Conventions

- Use native `fetch` for HTTP requests (no axios)
- All API modules are class-based with constructor `(apiKey: string)`
- All API methods return `Promise<T>` with typed responses
- Components are functional React components with TypeScript props
- Use `@maplibre/maplibre-react-native` MapView as the base map renderer
- API base URL: `https://api.olamaps.io`
- Authentication: `api_key` query parameter on all requests
- License: GNU LGPLv3

## Key APIs

| Endpoint   | Base Path              |
| ---------- | ---------------------- |
| Places     | `/places/v1/`          |
| Routing    | `/routing/v1/`         |
| Geofencing | `/geofencing/v1/`      |
| Elevation  | `/places/v1/elevation` |
| Tiles      | `/tiles/vector/v1/`    |

## Style Guide

- TypeScript strict mode
- ESLint flat config + Prettier
- Single quotes, 2-space indent, trailing commas
- Named exports for components and hooks
- Default export for the main OlaMapsClient class
- Functional components only (no class components)

## Testing

- Jest + @testing-library/react-native
- Unit tests for API modules (mock fetch)
- Component tests for React components
- Test files co-located: `__tests__/` directories

## Dependencies

- `@maplibre/maplibre-react-native` ^11.2.1 — Map rendering
- `react` >= 19.1.0 — Peer dependency
- `react-native` >= 0.80.0 — Peer dependency

import { forwardRef, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Camera, Map } from '@maplibre/maplibre-react-native';
import type {
  CameraProps as MapLibreCameraProps,
  MapProps as MapLibreMapProps,
  MapRef,
} from '@maplibre/maplibre-react-native';
import { IndiaMapsClient } from '../IndiaMapsClient';
import { IndiaMapsContext } from '../providers/IndiaMapsProvider';
import type { LatLng, LatLngInput, LngLat, MapProvider } from '../types/common';
import type { MapStyle } from '../types/tiles';
import { toLngLat } from '../utils/coordinates';

/** Initial visible region: a coordinate plus an optional zoom level. */
export type InitialRegion = LatLng & {
  /** Initial zoom level. @default 12 */
  zoomLevel?: number;
};

/**
 * Props for {@linkcode MapView}: MapLibre map props with `mapStyle` replaced
 * by provider style configuration and `onDidFinishLoadingMap` renamed to
 * `onMapReady`.
 */
export type IndiaMapViewProps = {
  /** Ola Maps API key, used when no `client` or provider context is available. */
  apiKey?: string;

  /** Access token (Mappls or `apiKey` alias), used when no `client` or provider context is available. */
  accessToken?: string;

  /** Backend provider, used when no `client` or provider context is available. @default 'ola' */
  provider?: MapProvider;

  /** Preconfigured client; takes precedence over credentials and context. */
  client?: IndiaMapsClient;

  /** Map style identifier. @default 'default-light-standard' */
  styleName?: MapStyle;

  /** Initial center coordinate in `[longitude, latitude]` order. */
  initialCenter?: LngLat;

  /** Initial zoom level. @default 12 */
  initialZoom?: number;

  /** Initial region; a convenience alternative to `initialCenter`/`initialZoom`. */
  initialRegion?: LatLngInput & { zoomLevel?: number };

  /** Extra props passed through to the MapLibre camera. */
  cameraProps?: Omit<MapLibreCameraProps, 'center' | 'zoom'>;

  children?: ReactNode;

  /** Called when the map finishes loading. */
  onMapReady?: () => void;
} & Omit<MapLibreMapProps, 'children' | 'mapStyle' | 'onDidFinishLoadingMap'>;

/**
 * MapLibre-backed map configured with provider tile styles. Resolves its
 * client from the `client` prop, the enclosing `IndiaMapsProvider`, or inline
 * credentials, in that order.
 *
 * @example
 * <MapView
 *   style={{ flex: 1 }}
 *   styleName={MAP_STYLES.lightStandard}
 *   initialRegion={{ latitude: 28.6139, longitude: 77.209, zoomLevel: 12 }}
 * />
 */
export const MapView = forwardRef<MapRef, IndiaMapViewProps>(
  (
    {
      apiKey,
      accessToken,
      provider,
      client,
      styleName,
      initialCenter,
      initialZoom,
      initialRegion,
      cameraProps,
      children,
      onMapReady,
      ...mapProps
    },
    ref
  ) => {
    const context = useContext(IndiaMapsContext);
    const resolvedClient = useMemo(() => {
      if (client) {
        return client;
      }
      if (context?.client) {
        return context.client;
      }
      return new IndiaMapsClient({ apiKey, accessToken, provider });
    }, [apiKey, accessToken, provider, client, context?.client]);

    const centerCoordinate =
      initialCenter ?? (initialRegion ? toLngLat(initialRegion) : undefined);
    const zoomLevel = initialZoom ?? initialRegion?.zoomLevel ?? 12;
    const mapStyle = resolvedClient.tiles.getStyleURL(styleName);

    return (
      <Map
        ref={ref}
        mapStyle={mapStyle}
        onDidFinishLoadingMap={onMapReady}
        {...mapProps}
      >
        <Camera
          center={centerCoordinate}
          zoom={zoomLevel}
          {...(cameraProps ?? {})}
        />
        {children}
      </Map>
    );
  }
);

MapView.displayName = 'MapView';

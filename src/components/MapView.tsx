import { forwardRef, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { IndiaMapsClient } from '../IndiaMapsClient';
import { IndiaMapsContext } from '../providers/IndiaMapsProvider';
import type { LatLng, LngLat } from '../types/common';
import { toLngLat } from '../types/common';
import type { MapStyle } from '../types/tiles';

export type InitialRegion = LatLng & {
  zoomLevel?: number;
};

export type IndiaMapViewProps = {
  accessToken?: string;
  apiKey?: string;
  client?: IndiaMapsClient;
  styleName?: MapStyle;
  initialCenter?: LngLat;
  initialZoom?: number;
  initialRegion?: InitialRegion;
  cameraProps?: Record<string, unknown>;
  children?: ReactNode;
  style?: Record<string, unknown>;
  onMapReady?: () => void;
  onRegionDidChange?: (event: unknown) => void;
};

export const MapView = forwardRef<any, IndiaMapViewProps>(
  (
    {
      accessToken,
      apiKey,
      client,
      styleName,
      initialCenter,
      initialZoom,
      initialRegion,
      cameraProps,
      children,
      ...mapProps
    },
    ref
  ) => {
    const context = useContext(IndiaMapsContext);
    const resolvedClient = useMemo(() => {
      if (client instanceof IndiaMapsClient) {
        return client;
      }

      if (context?.client instanceof IndiaMapsClient) {
        return context.client;
      }

      return new IndiaMapsClient({
        accessToken,
        apiKey,
      });
    }, [accessToken, apiKey, client, context?.client]);

    const centerCoordinate =
      initialCenter ?? (initialRegion ? toLngLat(initialRegion) : undefined);
    const zoomLevel = initialZoom ?? initialRegion?.zoomLevel ?? 12;
    const styleURL = resolvedClient.tiles.getStyleURL(styleName);

    return (
      <MapLibreGL.MapView
        ref={ref}
        styleURL={styleURL}
        {...(mapProps as Record<string, unknown>)}
      >
        <MapLibreGL.Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          {...(cameraProps ?? {})}
        />
        {children}
      </MapLibreGL.MapView>
    );
  }
);

MapView.displayName = 'MapView';
export type OlaMapViewProps = IndiaMapViewProps;

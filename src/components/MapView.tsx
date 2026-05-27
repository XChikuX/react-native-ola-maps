import { forwardRef, useContext, useMemo } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { IndiaMapsClient } from '../IndiaMapsClient';
import { loadMapplsMapSdk } from '../mappls/loaders';
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
    const sdk = loadMapplsMapSdk() as {
      MapView: ComponentType<Record<string, unknown>>;
      Camera?: ComponentType<Record<string, unknown>>;
    };
    const NativeMapView = sdk.MapView;
    const NativeCamera = sdk.Camera;
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
    const mapplsStyle = resolvedClient.tiles.getStyleName(styleName);

    return (
      <NativeMapView
        ref={ref}
        mapplsStyle={mapplsStyle}
        {...(mapProps as Record<string, unknown>)}
      >
        {NativeCamera ? (
          <NativeCamera
            centerCoordinate={centerCoordinate}
            zoomLevel={zoomLevel}
            {...(cameraProps ?? {})}
          />
        ) : null}
        {children}
      </NativeMapView>
    );
  }
);

MapView.displayName = 'MapView';
export type OlaMapViewProps = IndiaMapViewProps;

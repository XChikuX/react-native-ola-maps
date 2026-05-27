import { forwardRef, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Camera,
  Map,
  type CameraProps as MapLibreCameraProps,
  type MapProps as MapLibreMapProps,
  type MapRef,
} from '@maplibre/maplibre-react-native';
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
  cameraProps?: Omit<MapLibreCameraProps, 'center' | 'zoom'>;
  children?: ReactNode;
  onMapReady?: () => void;
} & Omit<MapLibreMapProps, 'children' | 'mapStyle' | 'onDidFinishLoadingMap'>;

export const MapView = forwardRef<MapRef, IndiaMapViewProps>(
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
    const mapStyle = resolvedClient.tiles.getStyleURL(styleName);

    return (
      <Map
        ref={ref}
        mapStyle={mapStyle}
        onDidFinishLoadingMap={onMapReady}
        {...(mapProps as Record<string, unknown>)}
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
export type OlaMapViewProps = IndiaMapViewProps;

import { forwardRef, useContext, useEffect, useMemo } from 'react';
import {
  Camera,
  Map,
  TransformRequestManager,
  type CameraProps,
  type MapProps,
  type MapRef,
  type StyleSpecification,
} from '@maplibre/maplibre-react-native';
import { OlaMapsClient } from '../OlaMapsClient';
import { OlaMapsContext } from '../providers/OlaMapsProvider';
import type { LatLng, LngLat } from '../types/common';
import { toLngLat } from '../types/common';
import type { MapStyle } from '../types/tiles';

export type InitialRegion = LatLng & {
  zoomLevel?: number;
  altitude?: number;
};

export type OlaMapViewProps = Omit<MapProps, 'mapStyle'> & {
  apiKey?: string;
  client?: OlaMapsClient;
  styleName?: MapStyle;
  mapStyle?: string | StyleSpecification;
  initialCenter?: LngLat;
  initialZoom?: number;
  initialRegion?: InitialRegion;
  cameraProps?: Omit<CameraProps, 'initialViewState'>;
};

export const MapView = forwardRef<MapRef, OlaMapViewProps>(
  (
    {
      apiKey,
      client,
      styleName,
      mapStyle,
      initialCenter,
      initialZoom,
      initialRegion,
      cameraProps,
      children,
      ...mapProps
    },
    ref
  ) => {
    const context = useContext(OlaMapsContext);
    const resolvedApiKey = apiKey ?? context?.apiKey;
    const resolvedClient = useMemo(() => {
      if (client) {
        return client;
      }
      if (context?.client) {
        return context.client;
      }
      if (resolvedApiKey) {
        return new OlaMapsClient({ apiKey: resolvedApiKey });
      }
      return undefined;
    }, [client, context?.client, resolvedApiKey]);

    if (!resolvedClient || !resolvedApiKey) {
      throw new Error(
        'MapView requires an apiKey prop or an OlaMapsProvider ancestor'
      );
    }

    const resolvedMapStyle =
      mapStyle ?? resolvedClient.tiles.getStyleURL(styleName);
    const center =
      initialCenter ?? (initialRegion ? toLngLat(initialRegion) : undefined);
    const zoom = initialZoom ?? initialRegion?.zoomLevel;

    useEffect(() => {
      const transformId = `ola-maps-api-key-${resolvedApiKey}`;
      TransformRequestManager.addUrlSearchParam({
        id: transformId,
        match: /api\.olamaps\.io/,
        name: 'api_key',
        value: resolvedApiKey,
      });
      return () => TransformRequestManager.removeUrlSearchParam(transformId);
    }, [resolvedApiKey]);

    return (
      <Map ref={ref} mapStyle={resolvedMapStyle} {...mapProps}>
        {(center || zoom != null || cameraProps) && (
          <Camera initialViewState={{ center, zoom }} {...cameraProps} />
        )}
        {children}
      </Map>
    );
  }
);

MapView.displayName = 'MapView';

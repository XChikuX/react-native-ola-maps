/**
 * Type declarations for @maplibre/maplibre-react-native
 * This is a peer dependency - types are provided here for compilation.
 */
declare module '@maplibre/maplibre-react-native' {
  import type { ComponentType, ReactNode } from 'react';
  import type { ViewStyle } from 'react-native';

  export interface MapViewProps {
    ref?: any;
    styleURL?: string;
    style?: ViewStyle | Record<string, unknown>;
    onDidFinishLoadingMap?: () => void;
    onRegionDidChange?: (event: unknown) => void;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export interface CameraProps {
    centerCoordinate?: [number, number];
    zoomLevel?: number;
    [key: string]: unknown;
  }

  export interface PointAnnotationProps {
    id: string;
    coordinate: [number, number];
    title?: string;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export interface ShapeSourceProps {
    id: string;
    shape?: GeoJSON.GeoJSON;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export interface LineLayerProps {
    id: string;
    style?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface FillLayerProps {
    id: string;
    style?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface UserLocationProps {
    visible?: boolean;
    renderMode?: string;
    [key: string]: unknown;
  }

  export interface CalloutProps {
    title?: string;
    children?: ReactNode;
    [key: string]: unknown;
  }

  interface MapLibreGL {
    MapView: ComponentType<MapViewProps>;
    Camera: ComponentType<CameraProps>;
    PointAnnotation: ComponentType<PointAnnotationProps>;
    ShapeSource: ComponentType<ShapeSourceProps>;
    LineLayer: ComponentType<LineLayerProps>;
    FillLayer: ComponentType<FillLayerProps>;
    UserLocation: ComponentType<UserLocationProps>;
    Callout: ComponentType<CalloutProps>;
  }

  const MapLibreGL: MapLibreGL;
  export default MapLibreGL;
}

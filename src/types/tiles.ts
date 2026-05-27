export type MapStyle = string;

export type MapOptions = {
  style?: MapStyle;
  center?: [number, number];
  zoom?: number;
  bearing?: number;
  pitch?: number;
};

export type StaticMapOptions = {
  style?: MapStyle;
  width: number;
  height: number;
  format?: 'png' | 'jpg';
  markers?: string[];
  markerIcon?: string;
  scaleFactor?: 0 | 1;
} & { center: [longitude: number, latitude: number]; zoom: number };

export type TransformRequest = {
  url: string;
  headers?: Record<string, string>;
};

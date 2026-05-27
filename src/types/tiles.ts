export type MapStyle =
  | 'default-light-lite'
  | 'default-light-standard'
  | 'default-ultra-light-standard'
  | 'default-light-full'
  | 'default-dark-lite'
  | 'default-dark-standard'
  | 'default-dark-full'
  | 'default-dark-standard-satellite'
  | 'eclipse-light-lite'
  | 'eclipse-light-standard'
  | 'eclipse-light-full'
  | 'eclipse-dark-lite'
  | 'eclipse-dark-standard'
  | 'eclipse-dark-full'
  | 'bolt-light'
  | 'bolt-dark'
  | 'vintage-light'
  | 'vintage-dark'
  | 'default-earth-lite'
  | 'default-earth-standard'
  | 'default-earth-full'
  | 'positron'
  | 'osm-bright'
  | 'osm-basic'
  | 'dark-matter'
  | 'fiord-color'
  | 'silver-osm'
  | string;

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
  paths?: string[];
} & (
  | { center: [longitude: number, latitude: number]; zoom: number }
  | { bbox: [minX: number, minY: number, maxX: number, maxY: number] }
  | { auto: true }
);

export type TransformRequest = {
  url: string;
  headers?: Record<string, string>;
};

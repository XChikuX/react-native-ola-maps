export type LatLng = {
  latitude: number;
  longitude: number;
};

export type LngLat = [longitude: number, latitude: number];

export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export type LatLngString = `${number},${number}`;

export type Language = 'en' | 'hi' | string;

export type ApiResponse<T> = {
  status: string;
  data: T;
  error?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  total?: number;
  page?: number;
  limit?: number;
};

export type MapProvider = 'ola' | 'mappls';

export type IndiaMapsConfig = {
  accessToken?: string;
  apiKey?: string;
  provider?: MapProvider;
  baseUrl?: string;
  searchBaseUrl?: string;
  routeBaseUrl?: string;
  sdkBaseUrl?: string;
  tileBaseUrl?: string;
};

export type OlaMapsConfig = IndiaMapsConfig;

export const resolveAccessToken = (config: IndiaMapsConfig) =>
  config.accessToken ?? config.apiKey;

export const resolveBaseUrl = (config: IndiaMapsConfig): string => {
  if (config.baseUrl) {
    return config.baseUrl;
  }
  return config.provider === 'mappls'
    ? 'https://atlas.mappls.com'
    : 'https://api.olamaps.io';
};

export const toLatLngString = (
  location: LatLng | LatLngLiteral | LatLngString
): LatLngString => {
  if (typeof location === 'string') {
    return location;
  }

  if ('latitude' in location) {
    return `${location.latitude},${location.longitude}`;
  }

  return `${location.lat},${location.lng}`;
};

export const toLngLat = (
  location: LatLng | LatLngLiteral | LatLngString
): LngLat => {
  if (typeof location === 'string') {
    const [lat, lng] = location.split(',').map(Number);
    return [lng ?? 0, lat ?? 0];
  }

  if ('latitude' in location) {
    return [location.longitude, location.latitude];
  }

  return [location.lng, location.lat];
};

export const toMapplsCoordinateString = (
  location: LatLng | LatLngLiteral | LatLngString | LngLat
) => {
  if (Array.isArray(location)) {
    return `${location[0]},${location[1]}`;
  }

  if (typeof location === 'string') {
    const [lat, lng] = location.split(',');
    return `${lng},${lat}`;
  }

  if ('latitude' in location) {
    return `${location.longitude},${location.latitude}`;
  }

  return `${location.lng},${location.lat}`;
};

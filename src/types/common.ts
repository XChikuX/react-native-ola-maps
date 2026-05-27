export type LatLng = {
  latitude: number;
  longitude: number;
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

export type OlaMapsConfig = {
  apiKey: string;
  baseUrl?: string;
};

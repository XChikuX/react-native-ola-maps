import type { Language, LatLng } from './common';

export type AutocompleteOptions = {
  location?: LatLng;
  radius?: number;
  strictbounds?: boolean;
  language?: Language;
  types?: string;
  zoom?: number;
  hyperLocal?: boolean;
  filter?: string;
  pod?: string;
  tokenizeAddress?: boolean;
};

export type AutocompleteResult = Record<string, unknown> & {
  mapplsPin?: string;
  placeName?: string;
  placeAddress?: string;
};

export type GeocodeResult = Record<string, unknown>;

export type ReverseGeocodeResult = GeocodeResult;

export type PlaceDetails = Record<string, unknown>;

export type NearbySearchOptions = {
  radius?: number;
  types?: string;
  rankBy?: 'prominence' | 'distance';
  rankby?: 'prominence' | 'distance';
  language?: Language;
  limit?: number;
  layers?: string;
  strictbounds?: boolean;
  withCentroid?: boolean;
  page?: number;
  bounds?: string;
  filter?: string;
  richData?: boolean;
  sortBy?: string;
  userName?: string;
  keyword?: string;
};

export type NearbySearchResult = Record<string, unknown>;

export type TextSearchOptions = {
  location?: LatLng;
  radius?: number;
  language?: Language;
  types?: string;
  size?: number;
  zoom?: number;
  hyperLocal?: boolean;
  filter?: string;
  pod?: string;
  tokenizeAddress?: boolean;
};

export type TextSearchResult = NearbySearchResult;

import type { Language, LatLng } from './common';

export type AutocompleteOptions = {
  location?: LatLng;
  radius?: number;
  strictbounds?: boolean;
  language?: Language;
  types?: string;
};

export type AutocompleteResult = {
  reference: string;
  place_id: string;
  description: string;
  matched_substrings: Array<{
    offset: number;
    length: number;
  }>;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: Array<{
      offset: number;
      length: number;
    }>;
  };
  terms: Array<{
    offset: number;
    value: string;
  }>;
  types: string[];
  distance_meters?: number;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

export type GeocodeResult = {
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  types: string[];
};

export type ReverseGeocodeResult = GeocodeResult;

export type PlaceDetails = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  types: string[];
};

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
};

export type NearbySearchResult = {
  place_id: string;
  name: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  vicinity: string;
  types: string[];
  rating?: number;
};

export type TextSearchOptions = {
  location?: LatLng;
  radius?: number;
  language?: Language;
  types?: string;
  size?: number;
};

export type TextSearchResult = NearbySearchResult;

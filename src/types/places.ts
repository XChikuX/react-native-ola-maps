import type { Language, LatLng } from './common';

export type AutocompleteOptions = {
  location?: LatLng;
  radius?: number;
  strictbounds?: boolean;
  language?: Language;
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
  rankby?: 'prominence' | 'distance';
  language?: Language;
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
};

export type TextSearchResult = NearbySearchResult;

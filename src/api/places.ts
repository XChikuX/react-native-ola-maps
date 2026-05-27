import { BaseApi } from './base';
import type {
  AutocompleteOptions,
  AutocompleteResult,
  GeocodeResult,
  ReverseGeocodeResult,
  PlaceDetails,
  NearbySearchOptions,
  NearbySearchResult,
  TextSearchOptions,
  TextSearchResult,
} from '../types/places';
import type { ApiResponse, Language } from '../types/common';

export class PlacesApi extends BaseApi {
  async autocomplete(
    input: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    return this.request('/places/v1/autocomplete', {
      params: {
        input,
        location: options?.location
          ? `${options.location.latitude},${options.location.longitude}`
          : undefined,
        radius: options?.radius?.toString(),
        strictbounds: options?.strictbounds?.toString(),
        language: options?.language,
      },
    });
  }

  async geocode(
    address: string,
    language?: Language
  ): Promise<ApiResponse<GeocodeResult[]>> {
    return this.request('/places/v1/geocode', {
      params: { address, language },
    });
  }

  async reverseGeocode(
    lat: number,
    lng: number,
    language?: Language
  ): Promise<ApiResponse<ReverseGeocodeResult[]>> {
    return this.request('/places/v1/reverse-geocode', {
      params: {
        latlng: `${lat},${lng}`,
        language,
      },
    });
  }

  async placeDetails(
    placeId: string,
    language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    return this.request('/places/v1/details', {
      params: { place_id: placeId, language },
    });
  }

  async placeDetailsAdvanced(
    placeId: string,
    language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    return this.request('/places/v1/details/advanced', {
      params: { place_id: placeId, language },
    });
  }

  async nearbySearch(
    location: { lat: number; lng: number },
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    return this.request('/places/v1/nearbysearch', {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: options?.radius?.toString(),
        types: options?.types,
        rankby: options?.rankby,
        language: options?.language,
      },
    });
  }

  async nearbySearchAdvanced(
    location: { lat: number; lng: number },
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    return this.request('/places/v1/nearbysearch/advanced', {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: options?.radius?.toString(),
        types: options?.types,
        rankby: options?.rankby,
        language: options?.language,
      },
    });
  }

  async textSearch(
    input: string,
    options?: TextSearchOptions
  ): Promise<ApiResponse<TextSearchResult[]>> {
    return this.request('/places/v1/textsearch', {
      params: {
        input,
        location: options?.location
          ? `${options.location.latitude},${options.location.longitude}`
          : undefined,
        radius: options?.radius?.toString(),
        language: options?.language,
      },
    });
  }

  async addressValidation(
    address: string
  ): Promise<ApiResponse<GeocodeResult>> {
    return this.request('/places/v1/address-validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
  }

  async photo(photoReference: string): Promise<Blob> {
    const url = new URL('/places/v1/photo', this.baseUrl);
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('photo_reference', photoReference);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `OlaMaps API error (${response.status}): Failed to fetch photo`
      );
    }
    return response.blob();
  }
}

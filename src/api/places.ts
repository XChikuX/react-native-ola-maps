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
import type { ApiResponse, Language, LatLngLiteral } from '../types/common';
import { toLatLngString } from '../types/common';

export class PlacesApi extends BaseApi {
  async autocomplete(
    input: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    return this.request('/places/v1/autocomplete', {
      params: {
        input,
        location: options?.location
          ? toLatLngString(options.location)
          : undefined,
        radius: options?.radius,
        strictbounds: options?.strictbounds,
        language: options?.language,
        types: options?.types,
      },
    });
  }

  async geocode(
    address: string,
    language?: Language,
    bounds?: string
  ): Promise<ApiResponse<GeocodeResult[]>> {
    return this.request('/places/v1/geocode', {
      params: { address, language, bounds },
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
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    return this.request('/places/v1/nearbysearch', {
      params: {
        location: toLatLngString(location),
        radius: options?.radius,
        types: options?.types,
        rankBy: options?.rankBy ?? options?.rankby,
        language: options?.language,
        limit: options?.limit,
        layers: options?.layers,
        strictbounds: options?.strictbounds,
        withCentroid: options?.withCentroid,
      },
    });
  }

  async nearbySearchAdvanced(
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    return this.request('/places/v1/nearbysearch/advanced', {
      params: {
        location: toLatLngString(location),
        radius: options?.radius,
        types: options?.types,
        rankBy: options?.rankBy ?? options?.rankby,
        language: options?.language,
        limit: options?.limit,
        layers: options?.layers,
        strictbounds: options?.strictbounds,
        withCentroid: options?.withCentroid,
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
          ? toLatLngString(options.location)
          : undefined,
        radius: options?.radius,
        language: options?.language,
        types: options?.types,
        size: options?.size,
      },
    });
  }

  async addressValidation(
    address: string
  ): Promise<ApiResponse<GeocodeResult>> {
    return this.request('/places/v1/addressvalidation', {
      params: { address },
    });
  }

  async photo(photoReference: string): Promise<Blob> {
    const url = this.buildUrl('/places/v1/photo', {
      photo_reference: photoReference,
    });

    const response = await fetch(url.toString(), {
      headers: { 'X-OlaMaps-RN-SDK-Version': '0.2.0' },
    });
    if (!response.ok) {
      throw new Error(
        `OlaMaps API error (${response.status}): Failed to fetch photo`
      );
    }
    return response.blob();
  }
}

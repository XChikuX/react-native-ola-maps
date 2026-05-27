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

const ok = <T>(data: T): ApiResponse<T> => ({ status: 'ok', data });

export class PlacesApi extends BaseApi {
  async autocomplete(
    input: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    if (this.provider === 'mappls') {
      return this.mapplsAutoSuggest(input, options);
    }
    return this.olaAutocomplete(input, options);
  }

  /** @deprecated Use autocomplete() instead */
  async autoSuggest(
    query: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    return this.autocomplete(query, options);
  }

  async geocode(
    address: string,
    language?: Language,
    _bounds?: string
  ): Promise<ApiResponse<GeocodeResult[]>> {
    if (this.provider === 'mappls') {
      return this.mapplsGeocode(address);
    }
    return this.olaGeocode(address, language);
  }

  async reverseGeocode(
    lat: number,
    lng: number,
    language?: Language
  ): Promise<ApiResponse<ReverseGeocodeResult[]>> {
    if (this.provider === 'mappls') {
      return this.mapplsReverseGeocode(lat, lng);
    }
    return this.olaReverseGeocode(lat, lng, language);
  }

  async placeDetails(
    placeId: string,
    language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    if (this.provider === 'mappls') {
      return this.mapplsPlaceDetails(placeId);
    }
    return this.olaPlaceDetails(placeId, language);
  }

  async placeDetailsAdvanced(
    placeId: string,
    language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    return this.placeDetails(placeId, language);
  }

  async nearbySearch(
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    if (this.provider === 'mappls') {
      return this.mapplsNearbySearch(location, options);
    }
    return this.olaNearbySearch(location, options);
  }

  async nearbySearchAdvanced(
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    return this.nearbySearch(location, options);
  }

  async textSearch(
    input: string,
    options?: TextSearchOptions
  ): Promise<ApiResponse<TextSearchResult[]>> {
    if (this.provider === 'mappls') {
      return this.autocomplete(input, options) as Promise<
        ApiResponse<TextSearchResult[]>
      >;
    }
    return this.olaTextSearch(input, options);
  }

  async addressValidation(
    address: string
  ): Promise<ApiResponse<GeocodeResult>> {
    const response = await this.geocode(address);
    return ok(response.data[0] as GeocodeResult);
  }

  // --- Ola Maps implementations ---

  private async olaAutocomplete(
    input: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    this.requireAccessToken('PlacesApi.autocomplete');
    const response = await this.request<{ predictions?: AutocompleteResult[] }>(
      '/places/v1/autocomplete',
      {
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
      }
    );
    return ok(response.predictions ?? []);
  }

  private async olaGeocode(
    address: string,
    language?: Language
  ): Promise<ApiResponse<GeocodeResult[]>> {
    this.requireAccessToken('PlacesApi.geocode');
    const response = await this.request<{
      geocodingResults?: GeocodeResult[];
    }>('/places/v1/geocode', {
      params: { address, language },
    });
    return ok(response.geocodingResults ?? []);
  }

  private async olaReverseGeocode(
    lat: number,
    lng: number,
    language?: Language
  ): Promise<ApiResponse<ReverseGeocodeResult[]>> {
    this.requireAccessToken('PlacesApi.reverseGeocode');
    const response = await this.request<{
      results?: ReverseGeocodeResult[];
    }>('/places/v1/reverse-geocode', {
      params: { latlng: `${lat},${lng}`, language },
    });
    return ok(response.results ?? []);
  }

  private async olaPlaceDetails(
    placeId: string,
    language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    this.requireAccessToken('PlacesApi.placeDetails');
    const response = await this.request<{ result?: PlaceDetails }>(
      '/places/v1/details',
      {
        params: { place_id: placeId, language },
      }
    );
    return ok(response.result ?? {});
  }

  private async olaNearbySearch(
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    this.requireAccessToken('PlacesApi.nearbySearch');
    const response = await this.request<{ predictions?: NearbySearchResult[] }>(
      '/places/v1/nearbysearch',
      {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: options?.radius,
          types: options?.types,
          keyword: options?.keyword,
          language: options?.language,
          rankby: options?.rankBy ?? options?.rankby,
        },
      }
    );
    return ok(response.predictions ?? []);
  }

  private async olaTextSearch(
    input: string,
    options?: TextSearchOptions
  ): Promise<ApiResponse<TextSearchResult[]>> {
    this.requireAccessToken('PlacesApi.textSearch');
    const response = await this.request<{ predictions?: TextSearchResult[] }>(
      '/places/v1/textsearch',
      {
        params: {
          input,
          location: options?.location
            ? toLatLngString(options.location)
            : undefined,
          radius: options?.radius,
          types: options?.types,
          language: options?.language,
        },
      }
    );
    return ok(response.predictions ?? []);
  }

  // --- Mappls implementations ---

  private async mapplsAutoSuggest(
    query: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    this.requireAccessToken('PlacesApi.autocomplete');
    const response = await this.request<{
      suggestedLocations?: AutocompleteResult[];
    }>('/api/places/search/json', {
      params: {
        query,
        location: options?.location
          ? toLatLngString(options.location)
          : undefined,
        zoom: options?.zoom,
        filter: options?.filter,
        pod: options?.pod,
        tokenizeAddress: options?.tokenizeAddress,
      },
    });
    return ok(response.suggestedLocations ?? []);
  }

  private async mapplsGeocode(
    address: string
  ): Promise<ApiResponse<GeocodeResult[]>> {
    this.requireAccessToken('PlacesApi.geocode');
    const response = await this.request<{ copResults?: GeocodeResult[] }>(
      '/api/places/geocode',
      {
        params: { address },
      }
    );
    return ok(response.copResults ?? []);
  }

  private async mapplsReverseGeocode(
    lat: number,
    lng: number
  ): Promise<ApiResponse<ReverseGeocodeResult[]>> {
    this.requireAccessToken('PlacesApi.reverseGeocode');
    const response = await this.request<{
      results?: ReverseGeocodeResult[];
    }>('/api/places/geocode', {
      params: { lat, lng },
    });
    return ok(response.results ?? []);
  }

  private async mapplsPlaceDetails(
    mapplsPin: string
  ): Promise<ApiResponse<PlaceDetails>> {
    this.requireAccessToken('PlacesApi.placeDetails');
    const response = await this.request<PlaceDetails>(
      `/api/places/place_detail/${mapplsPin}`
    );
    return ok(response);
  }

  private async mapplsNearbySearch(
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    this.requireAccessToken('PlacesApi.nearbySearch');
    const response = await this.request<{
      suggestedLocations?: NearbySearchResult[];
    }>('/api/places/nearby/json', {
      params: {
        keyword: options?.keyword ?? options?.types ?? '',
        location: `${location.lat},${location.lng}`,
        page: options?.page,
        radius: options?.radius,
        bounds: options?.bounds,
        filter: options?.filter,
        richData: options?.richData,
        sortBy: options?.sortBy,
      },
    });
    return ok(response.suggestedLocations ?? []);
  }

  toMapplsLocation(location: LatLngLiteral) {
    return `${location.lat},${location.lng}`;
  }
}

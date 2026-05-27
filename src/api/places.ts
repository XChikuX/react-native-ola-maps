import { BaseApi } from './base';
import { callMapplsRestApi } from './native';
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
import { toLatLngString, toMapplsCoordinateString } from '../types/common';

const toLocationObject = (location: AutocompleteOptions['location']) =>
  location
    ? { latitude: location.latitude, longitude: location.longitude }
    : undefined;

const ok = <T>(data: T): ApiResponse<T> => ({ status: 'ok', data });

export class PlacesApi extends BaseApi {
  async autoSuggest(
    query: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    const response = (await callMapplsRestApi<Record<string, unknown>>(
      'autoSuggest',
      {
        query,
        location: toLocationObject(options?.location),
        zoom: options?.zoom,
        hyperLocal: options?.hyperLocal,
        filter: options?.filter,
        pod: options?.pod,
        tokenizeAddress: options?.tokenizeAddress,
      }
    )) as {
      suggestedLocations?: AutocompleteResult[];
    };

    return ok(response.suggestedLocations ?? []);
  }

  async autocomplete(
    input: string,
    options?: AutocompleteOptions
  ): Promise<ApiResponse<AutocompleteResult[]>> {
    return this.autoSuggest(input, options);
  }

  async geocode(
    address: string,
    _language?: Language,
    _bounds?: string
  ): Promise<ApiResponse<GeocodeResult[]>> {
    const response = (await callMapplsRestApi<Record<string, unknown>>(
      'geocode',
      { address }
    )) as { results?: GeocodeResult[] };
    return ok(response.results ?? []);
  }

  async reverseGeocode(
    lat: number,
    lng: number,
    _language?: Language
  ): Promise<ApiResponse<ReverseGeocodeResult[]>> {
    const response = (await callMapplsRestApi<Record<string, unknown>>(
      'reverseGeocode',
      { latitude: lat, longitude: lng }
    )) as { results?: ReverseGeocodeResult[] };
    return ok(response.results ?? []);
  }

  async placeDetails(
    mapplsPin: string,
    _language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    const response = (await callMapplsRestApi<PlaceDetails>('placeDetail', {
      mapplsPin,
    })) as PlaceDetails;
    return ok(response);
  }

  async placeDetailsAdvanced(
    mapplsPin: string,
    language?: Language
  ): Promise<ApiResponse<PlaceDetails>> {
    return this.placeDetails(mapplsPin, language);
  }

  async nearbySearch(
    location: LatLngLiteral,
    options?: NearbySearchOptions
  ): Promise<ApiResponse<NearbySearchResult[]>> {
    const response = (await callMapplsRestApi<Record<string, unknown>>(
      'nearby',
      {
        keyword: options?.keyword ?? options?.types ?? '',
        location: toLatLngString(location),
        page: options?.page,
        radius: options?.radius,
        bounds: options?.bounds,
        filter: options?.filter,
        richData: options?.richData,
        sortBy: options?.sortBy,
        userName: options?.userName,
      }
    )) as { suggestedLocations?: NearbySearchResult[] };
    return ok(response.suggestedLocations ?? []);
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
    return this.autoSuggest(input, options) as Promise<
      ApiResponse<TextSearchResult[]>
    >;
  }

  async poiAlongRoute(
    path: string,
    category: string,
    options?: {
      buffer?: number;
      geometries?: string;
      page?: number;
      sort?: boolean;
    }
  ) {
    return callMapplsRestApi('POIAlongRoute', {
      path,
      category,
      buffer: options?.buffer,
      geometries: options?.geometries,
      page: options?.page,
      sort: options?.sort,
    });
  }

  async addressValidation(
    address: string
  ): Promise<ApiResponse<GeocodeResult>> {
    const response = await this.geocode(address);
    return ok(response.data[0] as GeocodeResult);
  }

  async photo(photoReference: string): Promise<Blob> {
    this.requireAccessToken('PlacesApi.photo');
    const url = this.buildUrl('/search/maps/place/photo', {
      photo_reference: photoReference,
    });
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(
        `India Maps API error (${response.status}): Failed to fetch photo`
      );
    }
    return response.blob();
  }

  toMapplsLocation(location: LatLngLiteral) {
    return toMapplsCoordinateString(location);
  }
}

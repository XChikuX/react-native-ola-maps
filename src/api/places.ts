import { BaseApi } from './base';
import {
  arrayOf,
  asNumber,
  asString,
  toLatLngLiteral,
  type Raw,
} from '../utils/parse';
import { toLatLngString, toLngLat } from '../utils/coordinates';
import type {
  AutocompleteOptions,
  AutocompleteSuggestion,
  GeocodeOptions,
  GeocodeResult,
  NearbySearchOptions,
  NearbySearchResult,
  PlaceDetails,
  PlaceDetailsOptions,
  ReverseGeocodeOptions,
  ReverseGeocodeResult,
  TextSearchOptions,
  TextSearchResult,
} from '../types/places';
import type { LatLngInput } from '../types/common';

/** Reads a property from a nested provider object, or `undefined`. */
const rawAt = (value: unknown, key: string): unknown =>
  value !== null && typeof value === 'object' ? (value as Raw)[key] : undefined;

const normalizeSuggestion = (raw: Raw): AutocompleteSuggestion => ({
  placeId:
    asString(raw.place_id) ??
    asString(raw.mapplsPin) ??
    asString(raw.eLoc) ??
    '',
  name:
    asString(rawAt(raw.structuredFormatting, 'mainText')) ??
    asString(raw.description) ??
    asString(raw.placeName) ??
    '',
  address:
    asString(rawAt(raw.structuredFormatting, 'secondaryText')) ??
    asString(raw.description) ??
    asString(raw.placeAddress),
  distanceMeters: asNumber(raw.distanceMeters ?? raw.distance),
  location: toLatLngLiteral(
    raw.latitude ?? rawAt(rawAt(raw.geometry, 'location'), 'lat'),
    raw.longitude ?? rawAt(rawAt(raw.geometry, 'location'), 'lng')
  ),
  types: Array.isArray(raw.types)
    ? raw.types.filter((type): type is string => typeof type === 'string')
    : asString(raw.type) !== undefined
      ? [asString(raw.type) as string]
      : undefined,
});

const normalizePlace = (raw: Raw): GeocodeResult => ({
  placeId:
    asString(raw.place_id) ??
    asString(raw.mapplsPin) ??
    asString(raw.generatedId),
  formattedAddress:
    asString(raw.formatted_address) ??
    asString(raw.formattedAddress) ??
    asString(raw.placeAddress),
  location: toLatLngLiteral(
    rawAt(rawAt(raw.geometry, 'location'), 'lat') ?? raw.latitude,
    rawAt(rawAt(raw.geometry, 'location'), 'lng') ?? raw.longitude
  ),
});

const normalizePlaceDetails = (raw: Raw): PlaceDetails => ({
  placeId:
    asString(raw.place_id) ?? asString(raw.mapplsPin) ?? asString(raw.eLoc),
  name: asString(raw.name) ?? asString(raw.placeName),
  formattedAddress:
    asString(raw.formatted_address) ??
    asString(raw.formattedAddress) ??
    asString(raw.placeAddress),
  location: toLatLngLiteral(
    rawAt(rawAt(raw.geometry, 'location'), 'lat') ?? raw.latitude,
    rawAt(rawAt(raw.geometry, 'location'), 'lng') ?? raw.longitude
  ),
});

/**
 * Places API: autocomplete, geocoding, reverse geocoding, place details,
 * nearby search and text search — with provider-normalized results.
 */
export class PlacesApi extends BaseApi {
  /**
   * Returns place suggestions for a partial query.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async autocomplete(
    input: string,
    options?: AutocompleteOptions
  ): Promise<AutocompleteSuggestion[]> {
    this.requireAccessToken('PlacesApi.autocomplete');
    if (this.provider === 'mappls') {
      const response = await this.request<Raw>('/api/places/search/json', {
        params: {
          query: input,
          location: options?.location
            ? toLatLngString(options.location)
            : undefined,
          zoom: options?.zoom,
          filter: options?.filter,
          pod: options?.pod,
          tokenizeAddress: options?.tokenizeAddress,
          hyperLocal: options?.hyperLocal,
        },
      });
      return arrayOf(response.suggestedLocations).map(normalizeSuggestion);
    }

    const response = await this.request<Raw>('/places/v1/autocomplete', {
      params: {
        input,
        location: options?.location
          ? toLatLngString(options.location)
          : undefined,
        radius: options?.radius,
        strictbounds: options?.strictBounds,
        language: options?.language,
        types: options?.types,
      },
    });
    return arrayOf(response.predictions).map(normalizeSuggestion);
  }

  /**
   * Converts an address into coordinates.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async geocode(
    address: string,
    options?: GeocodeOptions
  ): Promise<GeocodeResult[]> {
    this.requireAccessToken('PlacesApi.geocode');
    if (this.provider === 'mappls') {
      const response = await this.request<Raw>('/api/places/geocode', {
        params: { address },
      });
      return arrayOf(response.copResults).map(normalizePlace);
    }

    const response = await this.request<Raw>('/places/v1/geocode', {
      params: { address, language: options?.language },
    });
    return arrayOf(response.geocodingResults).map(normalizePlace);
  }

  /**
   * Converts a coordinate into nearby addresses.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async reverseGeocode(
    location: LatLngInput,
    options?: ReverseGeocodeOptions
  ): Promise<ReverseGeocodeResult[]> {
    this.requireAccessToken('PlacesApi.reverseGeocode');
    const [lng, lat] = toLngLat(location);
    if (this.provider === 'mappls') {
      const response = await this.request<Raw>('/api/places/geocode', {
        params: { lat, lng },
      });
      const inner = (response.response ?? response ?? {}) as Raw;
      return arrayOf(inner.results).map(normalizePlace);
    }

    const response = await this.request<Raw>('/places/v1/reverse-geocode', {
      params: { latlng: `${lat},${lng}`, language: options?.language },
    });
    return arrayOf(response.results).map(normalizePlace);
  }

  /**
   * Returns details for a place identified by `placeId` (an Ola Maps
   * `place_id` or a Mappls eLoc/`mapplsPin`).
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async placeDetails(
    placeId: string,
    options?: PlaceDetailsOptions
  ): Promise<PlaceDetails> {
    this.requireAccessToken('PlacesApi.placeDetails');
    if (this.provider === 'mappls') {
      const response = await this.request<Raw>(
        `/api/places/place_detail/${placeId}`
      );
      return normalizePlaceDetails(response);
    }

    const response = await this.request<Raw>('/places/v1/details', {
      params: { place_id: placeId, language: options?.language },
    });
    return normalizePlaceDetails((response.result ?? {}) as Raw);
  }

  /**
   * Returns places near a coordinate.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async nearbySearch(
    location: LatLngInput,
    options?: NearbySearchOptions
  ): Promise<NearbySearchResult[]> {
    this.requireAccessToken('PlacesApi.nearbySearch');
    const locationString = toLatLngString(location);
    if (this.provider === 'mappls') {
      const response = await this.request<Raw>('/api/places/nearby/json', {
        params: {
          keywords: options?.keyword ?? options?.types ?? '',
          location: locationString,
          page: options?.page,
          radius: options?.radius,
          bounds: options?.bounds,
          filter: options?.filter,
          richData: options?.richData,
          sortBy: options?.sortBy,
        },
      });
      return arrayOf(response.suggestedLocations).map(normalizeSuggestion);
    }

    const response = await this.request<Raw>('/places/v1/nearbysearch', {
      params: {
        location: locationString,
        radius: options?.radius,
        types: options?.types,
        keyword: options?.keyword,
        language: options?.language,
        rankby: options?.rankBy,
      },
    });
    return arrayOf(response.predictions).map(normalizeSuggestion);
  }

  /**
   * Searches places with a free-text query.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async textSearch(
    input: string,
    options?: TextSearchOptions
  ): Promise<TextSearchResult[]> {
    this.requireAccessToken('PlacesApi.textSearch');
    if (this.provider === 'mappls') {
      return this.autocomplete(input, options);
    }

    const response = await this.request<Raw>('/places/v1/textsearch', {
      params: {
        input,
        location: options?.location
          ? toLatLngString(options.location)
          : undefined,
        radius: options?.radius,
        types: options?.types,
        language: options?.language,
      },
    });
    return arrayOf(response.predictions).map(normalizeSuggestion);
  }

  /**
   * Validates an address by geocoding it and returning the best match, or
   * `undefined` when the address has no results.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async addressValidation(address: string): Promise<GeocodeResult | undefined> {
    const results = await this.geocode(address);
    return results[0];
  }
}

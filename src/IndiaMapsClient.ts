import { PlacesApi } from './api/places';
import { RoutingApi } from './api/routing';
import { RoadsApi } from './api/roads';
import { GeofencingApi } from './api/geofencing';
import { ElevationApi } from './api/elevation';
import { TilesApi } from './api/tiles';
import { VERSION } from './version';
import type { IndiaMapsConfig } from './types/common';

/**
 * Entry point of the SDK. Creates one client with the given
 * {@linkcode IndiaMapsConfig} and exposes each capability as a namespaced
 * API: {@linkcode PlacesApi}, {@linkcode RoutingApi}, {@linkcode RoadsApi},
 * {@linkcode GeofencingApi}, {@linkcode ElevationApi} and {@linkcode TilesApi}.
 *
 * Constructing a client never throws; API calls validate configuration and
 * throw {@linkcode IndiaMapsError} on failure.
 *
 * @example
 * const client = new IndiaMapsClient({ apiKey: 'YOUR_OLA_MAPS_API_KEY' });
 * const suggestions = await client.places.autocomplete('koramangala');
 */
export class IndiaMapsClient {
  /** Version of this SDK. */
  static readonly VERSION = VERSION;

  /** Places: autocomplete, geocoding, search. */
  public readonly places: PlacesApi;

  /** Routing: directions, distance matrix, route optimization. */
  public readonly routing: RoutingApi;

  /** Roads: snap to road, nearest roads, speed limits. */
  public readonly roads: RoadsApi;

  /** Geofencing: fence CRUD and status checks (Ola Maps only). */
  public readonly geofencing: GeofencingApi;

  /** Elevation: single- and multi-point elevation. */
  public readonly elevation: ElevationApi;

  /** Tiles: style URLs, static maps, request transforms. */
  public readonly tiles: TilesApi;

  constructor(public readonly config: IndiaMapsConfig = {}) {
    this.places = new PlacesApi(config);
    this.routing = new RoutingApi(config);
    this.roads = new RoadsApi(config);
    this.geofencing = new GeofencingApi(config);
    this.elevation = new ElevationApi(config);
    this.tiles = new TilesApi(config);
  }
}

export default IndiaMapsClient;

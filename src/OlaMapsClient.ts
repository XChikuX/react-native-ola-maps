import { PlacesApi } from './api/places';
import { RoutingApi } from './api/routing';
import { RoadsApi } from './api/roads';
import { GeofencingApi } from './api/geofencing';
import { ElevationApi } from './api/elevation';
import { TilesApi } from './api/tiles';
import { OlaMapsError } from './errors';
import { VERSION } from './version';
import type { OlaMapsConfig } from './types/common';

export class OlaMapsClient {
  static readonly VERSION = VERSION;

  public readonly places: PlacesApi;
  public readonly routing: RoutingApi;
  public readonly roads: RoadsApi;
  public readonly geofencing: GeofencingApi;
  public readonly elevation: ElevationApi;
  public readonly tiles: TilesApi;

  constructor(public readonly config: OlaMapsConfig) {
    if (!config.apiKey) {
      throw new OlaMapsError(
        'OlaMaps: apiKey is required',
        'CONFIGURATION_ERROR'
      );
    }

    this.places = new PlacesApi(config);
    this.routing = new RoutingApi(config);
    this.roads = new RoadsApi(config);
    this.geofencing = new GeofencingApi(config);
    this.elevation = new ElevationApi(config);
    this.tiles = new TilesApi(config);
  }
}

export default OlaMapsClient;

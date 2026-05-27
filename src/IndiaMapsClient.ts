import { PlacesApi } from './api/places';
import { RoutingApi } from './api/routing';
import { RoadsApi } from './api/roads';
import { GeofencingApi } from './api/geofencing';
import { ElevationApi } from './api/elevation';
import { TilesApi } from './api/tiles';
import { VERSION } from './version';
import type { IndiaMapsConfig } from './types/common';
import {
  loadMapplsDirectionWidget,
  loadMapplsGeofenceWidget,
  loadMapplsMapSdk,
  loadMapplsNearbyWidget,
  loadMapplsPolyline,
  loadMapplsSearchWidgets,
  loadMapplsTrackingSdk,
} from './mappls/loaders';

export class IndiaMapsClient {
  static readonly VERSION = VERSION;

  public readonly places: PlacesApi;
  public readonly routing: RoutingApi;
  public readonly roads: RoadsApi;
  public readonly geofencing: GeofencingApi;
  public readonly elevation: ElevationApi;
  public readonly tiles: TilesApi;

  public readonly sdk = {
    loadMapSdk: loadMapplsMapSdk,
    loadDirectionWidget: loadMapplsDirectionWidget,
    loadGeofenceWidget: loadMapplsGeofenceWidget,
    loadNearbyWidget: loadMapplsNearbyWidget,
    loadSearchWidgets: loadMapplsSearchWidgets,
    loadTrackingSdk: loadMapplsTrackingSdk,
    loadPolyline: loadMapplsPolyline,
  };

  constructor(public readonly config: IndiaMapsConfig = {}) {
    this.places = new PlacesApi(config);
    this.routing = new RoutingApi(config);
    this.roads = new RoadsApi(config);
    this.geofencing = new GeofencingApi();
    this.elevation = new ElevationApi(config);
    this.tiles = new TilesApi(config);
  }
}

export { IndiaMapsClient as OlaMapsClient };
export default IndiaMapsClient;

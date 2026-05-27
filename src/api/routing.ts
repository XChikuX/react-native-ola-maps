import { BaseApi } from './base';
import { callMapplsRestApi } from './native';
import type {
  DirectionsOptions,
  DirectionsResult,
  DistanceMatrixOptions,
  DistanceMatrixResult,
  RouteOptimizerOptions,
  RouteOptimizerResult,
  FleetPlannerInput,
  FleetPlannerStrategy,
  FleetPlannerResult,
} from '../types/routing';
import type { ApiResponse, LatLngString } from '../types/common';

const ok = <T>(data: T): ApiResponse<T> => ({ status: 'ok', data });
const joinCoordinates = (locations: LatLngString[], separator = ';') =>
  locations
    .map((value) => {
      const [lat, lng] = value.split(',');
      return `${lng},${lat}`;
    })
    .join(separator);

export class RoutingApi extends BaseApi {
  async getDirections(
    origin: LatLngString,
    destination: LatLngString,
    options?: DirectionsOptions
  ): Promise<ApiResponse<DirectionsResult>> {
    const response = await callMapplsRestApi<DirectionsResult>('direction', {
      origin: joinCoordinates([origin]),
      destination: joinCoordinates([destination]),
      waypoints: options?.waypoints
        ? joinCoordinates(options.waypoints)
        : undefined,
      profile: options?.mode,
      resource: options?.traffic_metadata
        ? 'route_traffic'
        : (options?.resource ?? 'route'),
      steps: options?.steps,
      overview: options?.overview,
      alternatives: options?.alternatives,
      geometries: options?.geometries,
    });
    return ok(response);
  }

  async getDirectionsBasic(
    origin: LatLngString,
    destination: LatLngString,
    options?: Omit<DirectionsOptions, 'traffic_metadata'>
  ): Promise<ApiResponse<DirectionsResult>> {
    return this.getDirections(
      origin,
      destination,
      options as DirectionsOptions
    );
  }

  async getDistanceMatrix(
    origins: LatLngString[],
    destinations: LatLngString[],
    options?: DistanceMatrixOptions
  ): Promise<ApiResponse<DistanceMatrixResult>> {
    const response = await callMapplsRestApi<DistanceMatrixResult>('distance', {
      coordinates: [...origins, ...destinations].map((value) => {
        const [lat, lng] = value.split(',');
        return `${lng},${lat}`;
      }),
      profile: options?.mode,
      resource: options?.resource,
    });
    return ok(response);
  }

  async getDistanceMatrixBasic(
    origins: LatLngString[],
    destinations: LatLngString[],
    options?: DistanceMatrixOptions
  ): Promise<ApiResponse<DistanceMatrixResult>> {
    return this.getDistanceMatrix(origins, destinations, options);
  }

  async routeOptimizer(
    locations: LatLngString[],
    options?: RouteOptimizerOptions
  ): Promise<ApiResponse<RouteOptimizerResult>> {
    this.requireAccessToken('RoutingApi.routeOptimizer');
    const resource = options?.traffic_metadata
      ? 'trip_optimization_traffic'
      : (options?.resource ?? 'trip_optimization_eta');
    const geopositions = joinCoordinates(locations);
    const response = await this.request<RouteOptimizerResult>(
      `/route/optimization/${resource}/${options?.mode ?? 'driving'}/${geopositions}`,
      {
        params: {
          source: options?.source,
          destination: options?.destination,
          roundtrip: options?.roundTrip ?? options?.roundtrip,
          steps: options?.steps,
          overview: options?.overview,
        },
      },
      { baseUrl: this.routeBaseUrl }
    );
    return ok(response);
  }

  async fleetPlanner(
    _inputData: FleetPlannerInput,
    _strategy: FleetPlannerStrategy
  ): Promise<ApiResponse<FleetPlannerResult>> {
    throw new Error(
      'Fleet planner is not exposed by the public Mappls React Native SDK. Use your own fleet backend or the dedicated Mappls product APIs.'
    );
  }
}

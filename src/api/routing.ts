import { BaseApi } from './base';
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

const toLngLatString = (value: LatLngString): string => {
  const [lat, lng] = value.split(',');
  return `${lng},${lat}`;
};

const joinCoordinates = (locations: LatLngString[], separator = ';') =>
  locations.map(toLngLatString).join(separator);

export class RoutingApi extends BaseApi {
  async getDirections(
    origin: LatLngString,
    destination: LatLngString,
    options?: DirectionsOptions
  ): Promise<ApiResponse<DirectionsResult>> {
    this.requireAccessToken('RoutingApi.getDirections');
    if (this.provider === 'mappls') {
      return this.mapplsDirections(origin, destination, options);
    }
    return this.olaDirections(origin, destination, options);
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
    this.requireAccessToken('RoutingApi.getDistanceMatrix');
    if (this.provider === 'mappls') {
      return this.mapplsDistanceMatrix(origins, destinations, options);
    }
    return this.olaDistanceMatrix(origins, destinations, options);
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
    if (this.provider === 'mappls') {
      return this.mapplsRouteOptimizer(locations, options);
    }
    return this.olaRouteOptimizer(locations, options);
  }

  async fleetPlanner(
    _inputData: FleetPlannerInput,
    _strategy: FleetPlannerStrategy
  ): Promise<ApiResponse<FleetPlannerResult>> {
    throw new Error(
      'Fleet planner is not available as a public REST API. Use a dedicated fleet management backend.'
    );
  }

  // --- Ola Maps implementations ---

  private async olaDirections(
    origin: LatLngString,
    destination: LatLngString,
    options?: DirectionsOptions
  ): Promise<ApiResponse<DirectionsResult>> {
    const coords = [origin, ...(options?.waypoints ?? []), destination];
    const geopositions = joinCoordinates(coords);
    const mode = options?.mode ?? 'driving';
    const response = await this.request<DirectionsResult>(
      `/routing/v1/directions/${mode}/${geopositions}`,
      {
        params: {
          alternatives: options?.alternatives,
          steps: options?.steps,
          overview: options?.overview,
          geometries: options?.geometries,
          traffic_metadata: options?.traffic_metadata,
        },
      }
    );
    return ok(response);
  }

  private async olaDistanceMatrix(
    origins: LatLngString[],
    destinations: LatLngString[],
    options?: DistanceMatrixOptions
  ): Promise<ApiResponse<DistanceMatrixResult>> {
    const mode = options?.mode ?? 'driving';
    const response = await this.request<DistanceMatrixResult>(
      `/routing/v1/distanceMatrix/${mode}`,
      {
        params: {
          origins: origins.map(toLngLatString).join('|'),
          destinations: destinations.map(toLngLatString).join('|'),
        },
      }
    );
    return ok(response);
  }

  private async olaRouteOptimizer(
    locations: LatLngString[],
    options?: RouteOptimizerOptions
  ): Promise<ApiResponse<RouteOptimizerResult>> {
    const mode = options?.mode ?? 'driving';
    const geopositions = joinCoordinates(locations);
    const response = await this.request<RouteOptimizerResult>(
      `/routing/v1/routeOptimizer/${mode}/${geopositions}`,
      {
        params: {
          source: options?.source,
          destination: options?.destination,
          roundtrip: options?.roundTrip ?? options?.roundtrip,
          steps: options?.steps,
          overview: options?.overview,
        },
      }
    );
    return ok(response);
  }

  // --- Mappls implementations ---

  private async mapplsDirections(
    origin: LatLngString,
    destination: LatLngString,
    options?: DirectionsOptions
  ): Promise<ApiResponse<DirectionsResult>> {
    const coords = [origin, ...(options?.waypoints ?? []), destination];
    const geopositions = joinCoordinates(coords);
    const mode = options?.mode ?? 'driving';
    const resource = options?.traffic_metadata
      ? 'route_traffic'
      : (options?.resource ?? 'route');
    const response = await this.request<DirectionsResult>(
      `/advancedmaps/v1/${this.accessToken}/direction/${resource}/${mode}/${geopositions}`,
      {
        params: {
          alternatives: options?.alternatives,
          steps: options?.steps,
          overview: options?.overview,
          geometries: options?.geometries,
        },
      },
      { baseUrl: this.routeBaseUrl, includeAccessToken: false }
    );
    return ok(response);
  }

  private async mapplsDistanceMatrix(
    origins: LatLngString[],
    destinations: LatLngString[],
    options?: DistanceMatrixOptions
  ): Promise<ApiResponse<DistanceMatrixResult>> {
    const allCoords = [...origins, ...destinations];
    const geopositions = joinCoordinates(allCoords);
    const mode = options?.mode ?? 'driving';
    const resource = options?.resource ?? 'distance_matrix';
    const response = await this.request<DistanceMatrixResult>(
      `/advancedmaps/v1/${this.accessToken}/${resource}/${mode}/${geopositions}`,
      {
        params: {
          sources: origins.map((_, i) => i).join(';'),
          destinations: origins.map((_, i) => i + origins.length).join(';'),
        },
      },
      { baseUrl: this.routeBaseUrl, includeAccessToken: false }
    );
    return ok(response);
  }

  private async mapplsRouteOptimizer(
    locations: LatLngString[],
    options?: RouteOptimizerOptions
  ): Promise<ApiResponse<RouteOptimizerResult>> {
    const resource = options?.traffic_metadata
      ? 'trip_optimization_traffic'
      : (options?.resource ?? 'trip_optimization_eta');
    const mode = options?.mode ?? 'driving';
    const geopositions = joinCoordinates(locations);
    const response = await this.request<RouteOptimizerResult>(
      `/advancedmaps/v1/${this.accessToken}/${resource}/${mode}/${geopositions}`,
      {
        params: {
          source: options?.source,
          destination: options?.destination,
          roundtrip: options?.roundTrip ?? options?.roundtrip,
          steps: options?.steps,
          overview: options?.overview,
        },
      },
      { baseUrl: this.routeBaseUrl, includeAccessToken: false }
    );
    return ok(response);
  }
}

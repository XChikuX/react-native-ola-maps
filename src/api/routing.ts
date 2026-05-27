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

export class RoutingApi extends BaseApi {
  async getDirections(
    origin: LatLngString,
    destination: LatLngString,
    options?: DirectionsOptions
  ): Promise<ApiResponse<DirectionsResult>> {
    return this.request('/routing/v1/directions', {
      params: {
        origin,
        destination,
        alternatives: options?.alternatives?.toString(),
        steps: options?.steps?.toString(),
        overview: options?.overview,
        language: options?.language,
        traffic_metadata: options?.traffic_metadata?.toString(),
      },
    });
  }

  async getDirectionsBasic(
    origin: LatLngString,
    destination: LatLngString,
    options?: Omit<DirectionsOptions, 'traffic_metadata'>
  ): Promise<ApiResponse<DirectionsResult>> {
    return this.request('/routing/v1/directions/basic', {
      params: {
        origin,
        destination,
        alternatives: options?.alternatives?.toString(),
        steps: options?.steps?.toString(),
        overview: options?.overview,
        language: options?.language,
      },
    });
  }

  async getDistanceMatrix(
    origins: LatLngString[],
    destinations: LatLngString[],
    options?: DistanceMatrixOptions
  ): Promise<ApiResponse<DistanceMatrixResult>> {
    return this.request('/routing/v1/distanceMatrix', {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        mode: options?.mode,
        language: options?.language,
      },
    });
  }

  async getDistanceMatrixBasic(
    origins: LatLngString[],
    destinations: LatLngString[],
    options?: DistanceMatrixOptions
  ): Promise<ApiResponse<DistanceMatrixResult>> {
    return this.request('/routing/v1/distanceMatrix/basic', {
      params: {
        origins: origins.join('|'),
        destinations: destinations.join('|'),
        mode: options?.mode,
        language: options?.language,
      },
    });
  }

  async routeOptimizer(
    locations: LatLngString[],
    options?: RouteOptimizerOptions
  ): Promise<ApiResponse<RouteOptimizerResult>> {
    return this.request('/routing/v1/routeOptimizer', {
      params: {
        coordinates: locations.join(';'),
        source: options?.source,
        destination: options?.destination,
        roundtrip: options?.roundtrip?.toString(),
      },
    });
  }

  async fleetPlanner(
    inputData: FleetPlannerInput,
    strategy: FleetPlannerStrategy
  ): Promise<ApiResponse<FleetPlannerResult>> {
    return this.request('/routing/v1/fleetPlanner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...inputData, strategy }),
    });
  }
}

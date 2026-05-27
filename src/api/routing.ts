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

const joinCoordinates = (locations: LatLngString[]) => locations.join('|');

export class RoutingApi extends BaseApi {
  async getDirections(
    origin: LatLngString,
    destination: LatLngString,
    options?: DirectionsOptions
  ): Promise<ApiResponse<DirectionsResult>> {
    return this.request('/routing/v1/directions', {
      method: 'POST',
      params: {
        origin,
        destination,
        alternatives: options?.alternatives,
        steps: options?.steps,
        overview: options?.overview,
        language: options?.language,
        traffic_metadata: options?.traffic_metadata,
        waypoints: options?.waypoints?.join('|'),
        mode: options?.mode,
        route_preference: options?.route_preference,
      },
    });
  }

  async getDirectionsBasic(
    origin: LatLngString,
    destination: LatLngString,
    options?: Omit<DirectionsOptions, 'traffic_metadata'>
  ): Promise<ApiResponse<DirectionsResult>> {
    return this.request('/routing/v1/directions/basic', {
      method: 'POST',
      params: {
        origin,
        destination,
        alternatives: options?.alternatives,
        steps: options?.steps,
        overview: options?.overview,
        language: options?.language,
        waypoints: options?.waypoints?.join('|'),
        mode: options?.mode,
        route_preference: options?.route_preference,
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
        origins: joinCoordinates(origins),
        destinations: joinCoordinates(destinations),
        mode: options?.mode,
        language: options?.language,
        route_preference: options?.route_preference,
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
        origins: joinCoordinates(origins),
        destinations: joinCoordinates(destinations),
        mode: options?.mode,
        language: options?.language,
        route_preference: options?.route_preference,
      },
    });
  }

  async routeOptimizer(
    locations: LatLngString[],
    options?: RouteOptimizerOptions
  ): Promise<ApiResponse<RouteOptimizerResult>> {
    return this.request('/routing/v1/routeOptimizer', {
      method: 'POST',
      params: {
        locations: joinCoordinates(locations),
        source: options?.source,
        destination: options?.destination,
        round_trip: options?.roundTrip ?? options?.roundtrip,
        mode: options?.mode,
        steps: options?.steps,
        overview: options?.overview,
        language: options?.language,
        traffic_metadata: options?.traffic_metadata,
        route_preference: options?.route_preference,
      },
    });
  }

  async fleetPlanner(
    inputData: FleetPlannerInput,
    strategy: FleetPlannerStrategy
  ): Promise<ApiResponse<FleetPlannerResult>> {
    const formData = new FormData();
    formData.append('input', JSON.stringify(inputData));

    return this.request('/routing/v1/fleetPlanner', {
      method: 'POST',
      params: { strategy },
      body: formData,
      skipJsonSerialization: true,
    });
  }
}

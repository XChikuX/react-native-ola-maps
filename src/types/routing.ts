import type { LatLngString } from './common';

export type DirectionsOptions = {
  alternatives?: boolean;
  steps?: boolean;
  overview?: 'full' | 'simplified' | 'false';
  language?: string;
  traffic_metadata?: boolean;
  waypoints?: LatLngString[];
  mode?: 'driving' | 'walking' | 'bicycling' | 'trucking' | string;
  route_preference?: 'shortest' | 'fastest' | 'eco' | string;
  resource?: 'route' | 'route_eta' | 'route_traffic' | string;
  geometries?: 'polyline' | 'polyline6' | 'geojson' | string;
};

export type RouteStep = Record<string, unknown>;
export type RouteLeg = Record<string, unknown>;
export type Route = Record<string, unknown>;

export type DirectionsResult = Record<string, unknown>;

export type DistanceMatrixOptions = {
  mode?: 'driving' | 'walking' | 'bicycling' | string;
  language?: string;
  route_preference?: 'shortest' | 'fastest' | 'eco' | string;
  resource?:
    | 'distance_matrix'
    | 'distance_matrix_eta'
    | 'distance_matrix_traffic'
    | string;
};

export type DistanceMatrixElement = Record<string, unknown>;
export type DistanceMatrixResult = Record<string, unknown>;

export type RouteOptimizerOptions = {
  source?: 'first' | 'last' | 'any';
  destination?: 'first' | 'last' | 'any';
  roundTrip?: boolean;
  roundtrip?: boolean;
  mode?: 'driving' | 'walking' | 'bicycling' | string;
  steps?: boolean;
  overview?: 'full' | 'simplified' | 'false';
  language?: string;
  traffic_metadata?: boolean;
  route_preference?: 'shortest' | 'fastest' | 'eco' | string;
  resource?:
    | 'trip_optimization'
    | 'trip_optimization_eta'
    | 'trip_optimization_traffic'
    | string;
};

export type RouteOptimizerResult = Record<string, unknown>;

export type FleetPlannerStrategy = 'cost' | 'time' | 'distance';
export type FleetPlannerInput = Record<string, unknown>;
export type FleetPlannerResult = Record<string, unknown>;

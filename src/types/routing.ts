import type { LatLngString } from './common';

export type DirectionsOptions = {
  alternatives?: boolean;
  steps?: boolean;
  overview?: 'full' | 'simplified' | 'false';
  language?: string;
  traffic_metadata?: boolean;
};

export type RouteStep = {
  distance: number;
  duration: number;
  geometry: string;
  name: string;
  mode: string;
  maneuver: {
    location: [number, number];
    type: string;
    modifier?: string;
    instruction: string;
  };
};

export type RouteLeg = {
  distance: number;
  duration: number;
  steps: RouteStep[];
  summary: string;
};

export type Route = {
  distance: number;
  duration: number;
  geometry: string;
  legs: RouteLeg[];
  overview_polyline?: string;
  weight: number;
  weight_name: string;
};

export type DirectionsResult = {
  routes: Route[];
  waypoints: Array<{
    location: [number, number];
    name: string;
  }>;
};

export type DistanceMatrixOptions = {
  mode?: 'driving' | 'walking' | 'bicycling';
  language?: string;
};

export type DistanceMatrixElement = {
  distance: { value: number; text: string };
  duration: { value: number; text: string };
  status: string;
};

export type DistanceMatrixResult = {
  origin_addresses: string[];
  destination_addresses: string[];
  rows: Array<{
    elements: DistanceMatrixElement[];
  }>;
};

export type RouteOptimizerOptions = {
  source?: 'first' | 'last' | 'any';
  destination?: 'first' | 'last' | 'any';
  roundtrip?: boolean;
};

export type RouteOptimizerResult = {
  trips: Route[];
  waypoints: Array<{
    waypoint_index: number;
    trips_index: number;
    location: [number, number];
    name: string;
  }>;
};

export type FleetPlannerStrategy = 'cost' | 'time' | 'distance';

export type FleetPlannerInput = {
  vehicles: Array<{
    id: string;
    start: LatLngString;
    end?: LatLngString;
    capacity?: number[];
  }>;
  jobs: Array<{
    id: string;
    location: LatLngString;
    delivery?: number[];
    pickup?: number[];
    service?: number;
  }>;
};

export type FleetPlannerResult = {
  routes: Array<{
    vehicle: string;
    steps: Array<{
      type: string;
      job?: string;
      location: [number, number];
      arrival: number;
      duration: number;
    }>;
    cost: number;
    duration: number;
    distance: number;
  }>;
  unassigned: Array<{ id: string; reason: string }>;
};

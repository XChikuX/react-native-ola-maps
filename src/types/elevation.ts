import type { LatLngLiteral } from './common';

/** Elevation of a single coordinate. */
export type ElevationResult = {
  /** Elevation in meters above sea level. */
  elevation: number;

  /** Coordinate the elevation belongs to, when reported. */
  location?: LatLngLiteral;

  /** Maximum distance in meters between sampled data points, when reported. */
  resolution?: number;
};

/**
 * Provider-normalized multi-point elevation result returned by
 * {@linkcode ElevationApi.getMultiElevation}, in input order.
 */
export type MultiElevationResult = {
  results: ElevationResult[];
};

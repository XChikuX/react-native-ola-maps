import { BaseApi } from './base';
import { IndiaMapsError } from '../errors';
import { arrayOf, asNumber, asString, type Raw } from '../utils/parse';
import type {
  NearestRoadsResult,
  RoadPoint,
  SnapToRoadResult,
  SnappedPoint,
  SpeedLimitsResult,
} from '../types/roads';

type TravelMode = 'driving' | 'walking' | 'biking' | 'trucking' | string;

const serializePoints = (points: RoadPoint[]) =>
  points.map((point) => `${point.latitude},${point.longitude}`).join('|');

const serializePointsLngLat = (points: RoadPoint[]) =>
  points.map((point) => `${point.longitude},${point.latitude}`).join(';');

const toSnappedPoint = (raw: Raw): SnappedPoint | undefined => {
  const location = (raw.location ?? raw.position ?? raw ?? {}) as Raw;
  const latitude = asNumber(location.latitude ?? location.lat);
  const longitude = asNumber(
    location.longitude ?? location.lng ?? location.lon
  );
  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }
  return {
    location: { latitude, longitude },
    originalIndex: asNumber(raw.originalIndex ?? raw.index),
    placeId: asString(raw.placeId ?? raw.place_id),
  };
};

/**
 * Roads API: snap GPS points to the road network and look up speed limits.
 */
export class RoadsApi extends BaseApi {
  /**
   * Snaps GPS points to the road network. On Mappls this maps to the
   * snap-to-road endpoint with point-wise snapping (`type: 'break'`).
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async snapToRoad(
    points: RoadPoint[],
    enhancePath?: boolean
  ): Promise<SnapToRoadResult> {
    this.requireAccessToken('RoadsApi.snapToRoad');
    if (this.provider === 'mappls') {
      const body = new URLSearchParams();
      body.set('points', serializePointsLngLat(points));
      body.set('type', 'break');
      if (enhancePath) {
        body.set('search_radius', '12');
      }

      const response = await this.request<Raw>(
        `/advancedmaps/v1/${this.accessToken}/snapToRoad`,
        {
          method: 'POST',
          body,
          skipJsonSerialization: true,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
        { baseUrl: this.routeBaseUrl, includeAccessToken: false }
      );
      return { snappedPoints: this.normalizeSnappedPoints(response) };
    }

    const response = await this.request<Raw>('/routing/v1/snapToRoad', {
      params: {
        points: serializePoints(points),
        interpolate: enhancePath,
      },
    });
    return { snappedPoints: this.normalizeSnappedPoints(response) };
  }

  /**
   * Maps each input point to the nearest road. On Mappls this is implemented
   * via point-wise {@linkcode RoadsApi.snapToRoad}.
   *
   * @throws {@linkcode IndiaMapsError} on configuration, network or API failure.
   */
  async nearestRoads(
    points: RoadPoint[],
    mode?: TravelMode,
    radius?: number
  ): Promise<NearestRoadsResult> {
    this.requireAccessToken('RoadsApi.nearestRoads');
    if (this.provider === 'mappls') {
      return this.snapToRoad(points, Boolean(radius || mode));
    }

    const response = await this.request<Raw>('/routing/v1/nearestRoads', {
      params: {
        points: serializePoints(points),
        radius,
      },
    });
    return { snappedPoints: this.normalizeSnappedPoints(response) };
  }

  /**
   * Returns speed limits for the road segments nearest to the points.
   * Ola Maps only.
   *
   * @throws {@linkcode IndiaMapsError} with code `'UNSUPPORTED_ERROR'` when
   * the configured provider is Mappls; it has no public speed-limit API.
   */
  async speedLimits(
    points: RoadPoint[],
    _snapStrategy?: string
  ): Promise<SpeedLimitsResult> {
    this.requireAccessToken('RoadsApi.speedLimits');
    if (this.provider === 'mappls') {
      throw new IndiaMapsError(
        'Mappls does not expose speed limit lookup in the public API. Use a dedicated backend integration if your account has access.',
        'UNSUPPORTED_ERROR'
      );
    }

    const response = await this.request<Raw>('/routing/v1/speedLimits', {
      params: {
        points: serializePoints(points),
      },
    });
    const raw = (response ?? {}) as Raw;
    return {
      speedLimits: arrayOf(raw.speedLimits),
      snappedPoints: this.normalizeSnappedPoints(response),
    };
  }

  private normalizeSnappedPoints(response: unknown): SnappedPoint[] {
    const raw = (response ?? {}) as Raw;
    const list = arrayOf(raw.snappedPoints).length
      ? arrayOf(raw.snappedPoints)
      : arrayOf(raw.locations);
    return list
      .map(toSnappedPoint)
      .filter((point): point is SnappedPoint => point !== undefined);
  }
}

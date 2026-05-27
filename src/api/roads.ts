import { BaseApi } from './base';
import type {
  SnapToRoadPoint,
  SnapToRoadResult,
  NearestRoadsResult,
  SpeedLimitsResult,
} from '../types/roads';
import type { ApiResponse } from '../types/common';

type TravelMode = 'driving' | 'walking' | 'biking' | 'trucking' | string;

const serializePoints = (points: SnapToRoadPoint[]) =>
  points.map((p) => `${p.latitude},${p.longitude}`).join('|');

const serializePointsLngLat = (points: SnapToRoadPoint[]) =>
  points.map((p) => `${p.longitude},${p.latitude}`).join(';');

export class RoadsApi extends BaseApi {
  async snapToRoad(
    points: SnapToRoadPoint[],
    enhancePath?: boolean
  ): Promise<ApiResponse<SnapToRoadResult>> {
    this.requireAccessToken('RoadsApi.snapToRoad');
    if (this.provider === 'mappls') {
      return this.mapplsSnapToRoad(points, enhancePath);
    }
    return this.olaSnapToRoad(points, enhancePath);
  }

  async nearestRoads(
    points: SnapToRoadPoint[],
    mode?: TravelMode,
    radius?: number
  ): Promise<ApiResponse<NearestRoadsResult>> {
    this.requireAccessToken('RoadsApi.nearestRoads');
    if (this.provider === 'mappls') {
      return this.snapToRoad(points, Boolean(radius || mode)) as Promise<
        ApiResponse<NearestRoadsResult>
      >;
    }
    return this.olaNearestRoads(points, mode, radius);
  }

  async speedLimits(
    points: SnapToRoadPoint[],
    _snapStrategy?: string
  ): Promise<ApiResponse<SpeedLimitsResult>> {
    this.requireAccessToken('RoadsApi.speedLimits');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls does not expose speed limit lookup in the public API. Use a dedicated backend integration if your account has access.'
      );
    }
    return this.olaSpeedLimits(points);
  }

  // --- Ola Maps implementations ---

  private async olaSnapToRoad(
    points: SnapToRoadPoint[],
    enhancePath?: boolean
  ): Promise<ApiResponse<SnapToRoadResult>> {
    const response = await this.request<SnapToRoadResult>(
      '/routing/v1/snapToRoad',
      {
        params: {
          points: serializePoints(points),
          interpolate: enhancePath,
        },
      }
    );
    return { status: 'ok', data: response };
  }

  private async olaNearestRoads(
    points: SnapToRoadPoint[],
    _mode?: TravelMode,
    radius?: number
  ): Promise<ApiResponse<NearestRoadsResult>> {
    const response = await this.request<NearestRoadsResult>(
      '/routing/v1/nearestRoads',
      {
        params: {
          points: serializePoints(points),
          radius,
        },
      }
    );
    return { status: 'ok', data: response };
  }

  private async olaSpeedLimits(
    points: SnapToRoadPoint[]
  ): Promise<ApiResponse<SpeedLimitsResult>> {
    const response = await this.request<SpeedLimitsResult>(
      '/routing/v1/speedLimits',
      {
        params: {
          points: serializePoints(points),
        },
      }
    );
    return { status: 'ok', data: response };
  }

  // --- Mappls implementations ---

  private async mapplsSnapToRoad(
    points: SnapToRoadPoint[],
    enhancePath?: boolean
  ): Promise<ApiResponse<SnapToRoadResult>> {
    const body = new URLSearchParams();
    body.set('points', serializePointsLngLat(points));
    body.set('type', 'break');
    if (enhancePath) {
      body.set('search_radius', '12');
    }

    const response = await this.request<SnapToRoadResult>(
      '/advancedmaps/v1/' + this.accessToken + '/snapToRoad',
      {
        method: 'POST',
        body,
        skipJsonSerialization: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      { baseUrl: this.routeBaseUrl, includeAccessToken: false }
    );

    return { status: 'ok', data: response };
  }
}

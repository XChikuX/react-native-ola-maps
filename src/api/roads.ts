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
  points.map((p) => `${p.longitude},${p.latitude}`).join(';');

export class RoadsApi extends BaseApi {
  async snapToRoad(
    points: SnapToRoadPoint[],
    enhancePath?: boolean
  ): Promise<ApiResponse<SnapToRoadResult>> {
    this.requireAccessToken('RoadsApi.snapToRoad');
    const body = new URLSearchParams();
    body.set('points', serializePoints(points));
    body.set('type', 'break');
    if (enhancePath) {
      body.set('search_radius', '12');
    }

    const response = await this.request<SnapToRoadResult>(
      '/routev2/movement/trace_route',
      {
        method: 'POST',
        body,
        skipJsonSerialization: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      { baseUrl: this.routeBaseUrl }
    );

    return { status: 'ok', data: response };
  }

  async nearestRoads(
    points: SnapToRoadPoint[],
    mode?: TravelMode,
    radius?: number
  ): Promise<ApiResponse<NearestRoadsResult>> {
    return this.snapToRoad(points, Boolean(radius || mode)) as Promise<
      ApiResponse<NearestRoadsResult>
    >;
  }

  async speedLimits(
    _points: SnapToRoadPoint[],
    _snapStrategy?: string
  ): Promise<ApiResponse<SpeedLimitsResult>> {
    throw new Error(
      'Mappls does not expose speed limit lookup in the public React Native SDK. Use a dedicated backend integration if your account has access.'
    );
  }
}

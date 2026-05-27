import { BaseApi } from './base';
import type {
  SnapToRoadPoint,
  SnapToRoadResult,
  NearestRoadsResult,
  SpeedLimitsResult,
} from '../types/roads';
import type { ApiResponse } from '../types/common';

export class RoadsApi extends BaseApi {
  async snapToRoad(
    points: SnapToRoadPoint[],
    interpolate?: boolean
  ): Promise<ApiResponse<SnapToRoadResult>> {
    const path = points
      .map((p) => `${p.latitude},${p.longitude}`)
      .join('|');
    return this.request('/routing/v1/snapToRoad', {
      params: {
        points: path,
        interpolate: interpolate?.toString(),
      },
    });
  }

  async nearestRoads(
    points: SnapToRoadPoint[],
    mode?: string,
    radius?: number
  ): Promise<ApiResponse<NearestRoadsResult>> {
    const path = points
      .map((p) => `${p.latitude},${p.longitude}`)
      .join('|');
    return this.request('/routing/v1/nearestRoads', {
      params: {
        points: path,
        mode,
        radius: radius?.toString(),
      },
    });
  }

  async speedLimits(
    points: SnapToRoadPoint[]
  ): Promise<ApiResponse<SpeedLimitsResult>> {
    const path = points
      .map((p) => `${p.latitude},${p.longitude}`)
      .join('|');
    return this.request('/routing/v1/speedLimits', {
      params: { points: path },
    });
  }
}

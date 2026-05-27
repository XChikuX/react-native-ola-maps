import { BaseApi } from './base';
import type {
  SnapToRoadPoint,
  SnapToRoadResult,
  NearestRoadsResult,
  SpeedLimitsResult,
} from '../types/roads';
import type { ApiResponse } from '../types/common';

type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT' | string;
type SnapStrategy = 'snaptoroad' | 'nearestroad';

const serializePoints = (points: SnapToRoadPoint[]) =>
  points.map((p) => `${p.latitude},${p.longitude}`).join('|');

export class RoadsApi extends BaseApi {
  async snapToRoad(
    points: SnapToRoadPoint[],
    enhancePath?: boolean
  ): Promise<ApiResponse<SnapToRoadResult>> {
    return this.request('/routing/v1/snapToRoad', {
      params: {
        points: serializePoints(points),
        enhancePath,
      },
    });
  }

  async nearestRoads(
    points: SnapToRoadPoint[],
    mode?: TravelMode,
    radius?: number
  ): Promise<ApiResponse<NearestRoadsResult>> {
    return this.request('/routing/v1/nearestRoads', {
      params: {
        points: serializePoints(points),
        mode,
        radius,
      },
    });
  }

  async speedLimits(
    points: SnapToRoadPoint[],
    snapStrategy?: SnapStrategy
  ): Promise<ApiResponse<SpeedLimitsResult>> {
    return this.request('/routing/v1/speedLimits', {
      params: { points: serializePoints(points), snapStrategy },
    });
  }
}

import { BaseApi } from './base';
import type { ElevationResult, MultiElevationResult } from '../types/elevation';
import type { ApiResponse } from '../types/common';

export class ElevationApi extends BaseApi {
  async getElevation(
    lat: number,
    lng: number
  ): Promise<ApiResponse<ElevationResult>> {
    return this.request('/elevation/v1/', {
      params: {
        locations: `${lat},${lng}`,
      },
    });
  }

  async getMultiElevation(
    points: Array<{ lat: number; lng: number }>
  ): Promise<ApiResponse<MultiElevationResult>> {
    const locations = points
      .map((p) => `${p.lat},${p.lng}`)
      .join('|');
    return this.request('/elevation/v1/', {
      params: { locations },
    });
  }
}

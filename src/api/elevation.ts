import { BaseApi } from './base';
import type { ElevationResult, MultiElevationResult } from '../types/elevation';
import type { ApiResponse } from '../types/common';

export class ElevationApi extends BaseApi {
  async getElevation(
    lat: number,
    lng: number
  ): Promise<ApiResponse<ElevationResult>> {
    return this.request('/places/v1/elevation', {
      params: {
        location: `${lat},${lng}`,
      },
    });
  }

  async getMultiElevation(
    points: Array<{ lat: number; lng: number }>
  ): Promise<ApiResponse<MultiElevationResult>> {
    return this.request('/places/v1/elevation', {
      method: 'POST',
      body: {
        locations: points.map((p) => `${p.lat},${p.lng}`),
      },
    });
  }
}

import { BaseApi } from './base';
import type { ElevationResult, MultiElevationResult } from '../types/elevation';
import type { ApiResponse } from '../types/common';

export class ElevationApi extends BaseApi {
  async getElevation(
    lat: number,
    lng: number
  ): Promise<ApiResponse<ElevationResult>> {
    const response = await this.getMultiElevation([{ lat, lng }]);
    return {
      status: response.status,
      data: response.data.results[0] as ElevationResult,
    };
  }

  async getMultiElevation(
    points: Array<{ lat: number; lng: number }>
  ): Promise<ApiResponse<MultiElevationResult>> {
    this.requireAccessToken('ElevationApi.getMultiElevation');
    const response = await this.request<MultiElevationResult>(
      '/map/utils/elevation',
      {
        params: {
          locations: points.map((p) => `${p.lat},${p.lng}`).join('|'),
        },
      },
      { baseUrl: this.sdkBaseUrl }
    );
    return { status: 'ok', data: response };
  }
}

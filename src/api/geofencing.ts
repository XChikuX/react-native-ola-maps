import { BaseApi } from './base';
import type {
  Geofence,
  GeofenceData,
  GeofenceStatusResult,
} from '../types/geofencing';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export class GeofencingApi extends BaseApi {
  async create(
    geofenceData: GeofenceData
  ): Promise<ApiResponse<Geofence>> {
    return this.request('/geofencing/v1/fences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geofenceData),
    });
  }

  async getById(fenceId: string): Promise<ApiResponse<Geofence>> {
    return this.request(`/geofencing/v1/fences/${fenceId}`);
  }

  async update(
    fenceId: string,
    data: Partial<GeofenceData>
  ): Promise<ApiResponse<Geofence>> {
    return this.request(`/geofencing/v1/fences/${fenceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async deleteById(fenceId: string): Promise<ApiResponse<void>> {
    return this.request(`/geofencing/v1/fences/${fenceId}`, {
      method: 'DELETE',
    });
  }

  async list(
    projectId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Geofence[]>> {
    return this.request('/geofencing/v1/fences', {
      params: {
        projectId,
        page: page?.toString(),
        limit: limit?.toString(),
      },
    });
  }

  async checkStatus(
    fenceId: string,
    location: { lat: number; lng: number }
  ): Promise<ApiResponse<GeofenceStatusResult>> {
    return this.request(`/geofencing/v1/fences/${fenceId}/status`, {
      params: {
        lat: location.lat.toString(),
        lng: location.lng.toString(),
      },
    });
  }
}

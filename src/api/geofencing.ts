import { BaseApi } from './base';
import type {
  Geofence,
  GeofenceData,
  GeofenceStatusResult,
} from '../types/geofencing';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export class GeofencingApi extends BaseApi {
  async create(geofenceData: GeofenceData): Promise<ApiResponse<Geofence>> {
    this.requireAccessToken('GeofencingApi.create');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls geofencing CRUD is not part of the public Mappls REST API. Use the dedicated InTouch APIs on your backend.'
      );
    }
    const response = await this.request<Geofence>('/geofencing/v1/fences', {
      method: 'POST',
      body: geofenceData,
    });
    return { status: 'ok', data: response };
  }

  async getById(fenceId: string): Promise<ApiResponse<Geofence>> {
    this.requireAccessToken('GeofencingApi.getById');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls geofencing CRUD is not part of the public Mappls REST API.'
      );
    }
    const response = await this.request<Geofence>(
      `/geofencing/v1/fences/${fenceId}`
    );
    return { status: 'ok', data: response };
  }

  async update(
    fenceId: string,
    data: Partial<GeofenceData>
  ): Promise<ApiResponse<Geofence>> {
    this.requireAccessToken('GeofencingApi.update');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls geofencing CRUD is not part of the public Mappls REST API.'
      );
    }
    const response = await this.request<Geofence>(
      `/geofencing/v1/fences/${fenceId}`,
      {
        method: 'PUT',
        body: data,
      }
    );
    return { status: 'ok', data: response };
  }

  async deleteById(fenceId: string): Promise<ApiResponse<void>> {
    this.requireAccessToken('GeofencingApi.deleteById');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls geofencing CRUD is not part of the public Mappls REST API.'
      );
    }
    await this.request<void>(`/geofencing/v1/fences/${fenceId}`, {
      method: 'DELETE',
    });
    return { status: 'ok', data: undefined };
  }

  async list(
    projectId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Geofence[]>> {
    this.requireAccessToken('GeofencingApi.list');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls geofencing CRUD is not part of the public Mappls REST API.'
      );
    }
    const response = await this.request<{
      fences: Geofence[];
      total?: number;
    }>('/geofencing/v1/fences', {
      params: { project_id: projectId, page, limit },
    });
    return {
      status: 'ok',
      data: response.fences,
      total: response.total,
      page,
      limit,
    };
  }

  async checkStatus(
    fenceId: string,
    location: { lat: number; lng: number }
  ): Promise<ApiResponse<GeofenceStatusResult>> {
    this.requireAccessToken('GeofencingApi.checkStatus');
    if (this.provider === 'mappls') {
      throw new Error(
        'Mappls geofencing CRUD is not part of the public Mappls REST API.'
      );
    }
    const response = await this.request<GeofenceStatusResult>(
      `/geofencing/v1/fences/${fenceId}/status`,
      {
        params: { lat: location.lat, lng: location.lng },
      }
    );
    return { status: 'ok', data: response };
  }
}

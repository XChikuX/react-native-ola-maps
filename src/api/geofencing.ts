import type {
  Geofence,
  GeofenceData,
  GeofenceStatusResult,
} from '../types/geofencing';
import type { ApiResponse, PaginatedResponse } from '../types/common';
import { loadMapplsGeofenceWidget } from '../mappls/loaders';

const unsupported = (): never => {
  throw new Error(
    'Mappls geofencing CRUD is not part of the public mappls-map-react-native SDK. Use loadMapplsGeofenceWidget() for the official UI widget or integrate the separate InTouch APIs on your backend.'
  );
};

export class GeofencingApi {
  loadWidget() {
    return loadMapplsGeofenceWidget();
  }

  async create(_geofenceData: GeofenceData): Promise<ApiResponse<Geofence>> {
    return unsupported();
  }

  async getById(_fenceId: string): Promise<ApiResponse<Geofence>> {
    return unsupported();
  }

  async update(
    _fenceId: string,
    _data: Partial<GeofenceData>
  ): Promise<ApiResponse<Geofence>> {
    return unsupported();
  }

  async deleteById(_fenceId: string): Promise<ApiResponse<void>> {
    return unsupported();
  }

  async list(
    _projectId: string,
    _page?: number,
    _limit?: number
  ): Promise<PaginatedResponse<Geofence[]>> {
    return unsupported();
  }

  async checkStatus(
    _fenceId: string,
    _location: { lat: number; lng: number }
  ): Promise<ApiResponse<GeofenceStatusResult>> {
    return unsupported();
  }
}

export type GeofenceType = 'circle' | 'polygon';

export type GeofenceCircle = {
  type: 'circle';
  center: { lat: number; lng: number };
  radius: number;
};

export type GeofencePolygon = {
  type: 'polygon';
  coordinates: Array<{ lat: number; lng: number }>;
};

export type GeofenceGeometry = GeofenceCircle | GeofencePolygon;

export type GeofenceData = {
  name: string;
  projectId: string;
  geometry: GeofenceGeometry;
  metadata?: Record<string, string>;
};

export type Geofence = GeofenceData & {
  fenceId: string;
  createdAt: string;
  updatedAt: string;
};

export type GeofenceStatusResult = {
  fenceId: string;
  status: 'inside' | 'outside';
  distance?: number;
};

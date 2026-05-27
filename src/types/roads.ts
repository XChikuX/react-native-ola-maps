export type SnapToRoadPoint = {
  latitude: number;
  longitude: number;
};

export type SnappedPoint = {
  location: {
    latitude: number;
    longitude: number;
  };
  originalIndex?: number;
  placeId?: string;
};

export type SnapToRoadResult = {
  snappedPoints: SnappedPoint[];
};

export type NearestRoadsResult = {
  snappedPoints: SnappedPoint[];
};

export type SpeedLimit = {
  placeId: string;
  speedLimit: number;
  units: 'KPH' | 'MPH';
};

export type SpeedLimitsResult = {
  speedLimits: SpeedLimit[];
  snappedPoints: SnappedPoint[];
};

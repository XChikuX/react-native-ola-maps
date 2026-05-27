export type ElevationResult = {
  elevation: number;
  location: {
    lat: number;
    lng: number;
  };
  resolution: number;
};

export type MultiElevationResult = {
  results: ElevationResult[];
};

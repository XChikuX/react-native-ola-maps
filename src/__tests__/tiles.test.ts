import { TilesApi } from '../api/tiles';

describe('TilesApi', () => {
  const tiles = new TilesApi({ accessToken: 'test-token' });

  it('returns MapLibre style URL for Ola Maps', () => {
    const url = tiles.getStyleURL('default-light-standard');
    expect(url).toContain(
      '/tiles/vector/v1/styles/default-light-standard/style.json'
    );
    expect(url).toContain('api_key=test-token');
  });

  it('returns style name for Mappls provider', () => {
    const mapplsTiles = new TilesApi({
      accessToken: 'test-token',
      provider: 'mappls',
    });
    expect(mapplsTiles.getStyleURL('standard')).toBe('standard');
  });

  it('builds Ola static map URLs', () => {
    const url = tiles.getStaticMapURL({
      center: [77.6, 12.9],
      zoom: 12,
      width: 600,
      height: 400,
      markers: ['12.9,77.6'],
    });

    expect(url).toContain('/tiles/v1/styles/default/static');
    expect(url).toContain('center=12.9%2C77.6');
    expect(url).toContain('api_key=test-token');
  });

  it('accepts coordinates as markers', () => {
    const url = tiles.getStaticMapURL({
      center: [77.6, 12.9],
      zoom: 12,
      width: 600,
      height: 400,
      markers: [{ latitude: 12.9, longitude: 77.6 }],
    });

    expect(url).toContain('markers=12.9%2C77.6');
  });

  it('builds Mappls static map URLs', () => {
    const mapplsTiles = new TilesApi({
      accessToken: 'test-token',
      provider: 'mappls',
    });
    const url = mapplsTiles.getStaticMapURL({
      center: [77.6, 12.9],
      zoom: 12,
      width: 600,
      height: 400,
      markers: ['12.9,77.6'],
    });

    expect(url).toContain('/map/raster_tile/still_image');
    expect(url).toContain('center=12.9%2C77.6');
    expect(url).toContain('access_token=test-token');
  });

  it('throws a configuration error without a token', () => {
    const anonymousTiles = new TilesApi();
    expect(() =>
      anonymousTiles.getStaticMapURL({
        center: [77.6, 12.9],
        zoom: 12,
        width: 600,
        height: 400,
      })
    ).toThrowError(expect.objectContaining({ code: 'CONFIGURATION_ERROR' }));
  });

  it('returns v11-compatible map options', () => {
    expect(
      tiles.getMapOptions({
        style: 'default-light-standard',
        center: [77.6, 12.9],
        zoom: 14,
        bearing: 15,
        pitch: 30,
      })
    ).toEqual({
      mapStyle: expect.stringContaining(
        '/tiles/vector/v1/styles/default-light-standard/style.json'
      ),
      center: [77.6, 12.9],
      zoom: 14,
      bearing: 15,
      pitch: 30,
    });
  });
});

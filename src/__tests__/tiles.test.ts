import { TilesApi } from '../api/tiles';

describe('TilesApi', () => {
  const tiles = new TilesApi({ accessToken: 'test-token' });

  it('returns Mappls style names for native maps', () => {
    expect(tiles.getStyleURL('standard')).toBe('standard');
  });

  it('builds still image URLs', () => {
    const url = tiles.getStaticMapURL({
      center: [77.6, 12.9],
      zoom: 12,
      width: 600,
      height: 400,
      format: 'png',
      markers: ['12.9,77.6'],
    });

    expect(url).toContain('/map/raster_tile/still_image');
    expect(url).toContain('center=12.9%2C77.6');
    expect(url).toContain('access_token=test-token');
    expect(url).toContain('markers=12.9%2C77.6');
  });
});

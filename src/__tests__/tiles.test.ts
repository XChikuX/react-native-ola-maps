import { TilesApi } from '../api/tiles';

describe('TilesApi', () => {
  const tiles = new TilesApi({ apiKey: 'test-key' });

  it('builds MapLibre style URLs', () => {
    expect(tiles.getStyleURL('default-light-standard')).toBe(
      'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=test-key'
    );
  });

  it('builds static map URLs', () => {
    const url = tiles.getStaticMapURL({
      center: [77.6, 12.9],
      zoom: 12,
      width: 600,
      height: 400,
      format: 'png',
      markers: ['77.6,12.9|red'],
    });

    expect(url).toContain(
      '/tiles/v1/styles/default-light-standard/static/77.6,12.9,12/600x400.png'
    );
    expect(url).toContain('api_key=test-key');
    expect(url).toContain('marker=77.6%2C12.9%7Cred');
  });
});

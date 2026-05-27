import { IndiaMapsClient } from '../index';

const jsonResponse = (body: unknown) => ({
  ok: true,
  status: 200,
  headers: { get: () => 'application/json' },
  json: jest.fn().mockResolvedValue(body),
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
});

const fetchMock = global.fetch as jest.Mock;

describe('API endpoint construction (Ola Maps)', () => {
  let client: IndiaMapsClient;

  beforeEach(() => {
    client = new IndiaMapsClient({ accessToken: 'test-token' });
    fetchMock.mockResolvedValue(jsonResponse({ results: [] }));
  });

  it('uses Ola elevation endpoint', async () => {
    await client.elevation.getElevation(12.9, 77.6);
    expect(fetchMock.mock.calls[0][0]).toContain('/elevation/v1/getElevation');
    expect(fetchMock.mock.calls[0][0]).toContain('locations=12.9%2C77.6');
    expect(fetchMock.mock.calls[0][0]).toContain('api_key=test-token');
  });

  it('uses Ola route optimizer endpoint', async () => {
    await client.routing.routeOptimizer(['12.9,77.6', '13.0,77.7']);
    const optimizerUrl = fetchMock.mock.calls[0][0] as string;
    expect(optimizerUrl).toContain(
      '/routing/v1/routeOptimizer/driving/77.6,12.9;77.7,13.0'
    );
    expect(optimizerUrl).toContain('api_key=test-token');
  });

  it('uses Ola snap to road endpoint', async () => {
    await client.roads.snapToRoad([{ latitude: 12.9, longitude: 77.6 }], true);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/routing/v1/snapToRoad');
    expect(url).toContain('points=12.9%2C77.6');
  });

  it('uses Ola directions endpoint', async () => {
    await client.routing.getDirections('12.9,77.6', '13.0,77.7');
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/routing/v1/directions/driving/77.6,12.9;77.7,13.0');
    expect(url).toContain('api_key=test-token');
  });

  it('uses Ola autocomplete endpoint', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ predictions: [] }));
    await client.places.autocomplete('bangalore');
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/places/v1/autocomplete');
    expect(url).toContain('input=bangalore');
    expect(url).toContain('api_key=test-token');
  });
});

describe('API endpoint construction (Mappls)', () => {
  let client: IndiaMapsClient;

  beforeEach(() => {
    client = new IndiaMapsClient({
      accessToken: 'test-token',
      provider: 'mappls',
    });
    fetchMock.mockResolvedValue(jsonResponse({ results: [] }));
  });

  it('uses Mappls elevation endpoint', async () => {
    await client.elevation.getElevation(12.9, 77.6);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/advancedmaps/v1/test-token/elevation');
    expect(url).toContain('locations=12.9%2C77.6');
  });

  it('uses Mappls autosuggest endpoint', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ suggestedLocations: [] }));
    await client.places.autocomplete('delhi');
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/api/places/search/json');
    expect(url).toContain('query=delhi');
    expect(url).toContain('access_token=test-token');
  });
});

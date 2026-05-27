import { IndiaMapsClient } from '../index';

const jsonResponse = (body: unknown) => ({
  ok: true,
  status: 200,
  headers: { get: () => 'application/json' },
  json: jest.fn().mockResolvedValue(body),
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
});

const fetchMock = global.fetch as jest.Mock;

describe('API endpoint construction', () => {
  let client: IndiaMapsClient;

  beforeEach(() => {
    client = new IndiaMapsClient({ accessToken: 'test-token' });
    fetchMock.mockResolvedValue(jsonResponse({ results: [] }));
  });

  it('uses verified Mappls elevation endpoint', async () => {
    await client.elevation.getElevation(12.9, 77.6);
    expect(fetchMock.mock.calls[0][0]).toContain('/map/utils/elevation');
    expect(fetchMock.mock.calls[0][0]).toContain('locations=12.9%2C77.6');
    expect(fetchMock.mock.calls[0][0]).toContain('access_token=test-token');
  });

  it('uses verified route optimizer params', async () => {
    await client.routing.routeOptimizer(['12.9,77.6', '13.0,77.7'], {
      roundTrip: true,
    });
    const optimizerUrl = fetchMock.mock.calls[0][0] as string;
    expect(optimizerUrl).toContain(
      '/route/optimization/trip_optimization_eta/driving/77.6,12.9;77.7,13.0'
    );
    expect(optimizerUrl).toContain('roundtrip=true');
    expect(optimizerUrl).toContain('access_token=test-token');
  });

  it('uses verified snap to road endpoint', async () => {
    await client.roads.snapToRoad([{ latitude: 12.9, longitude: 77.6 }], true);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/routev2/movement/trace_route');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });
});

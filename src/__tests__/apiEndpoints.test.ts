import { OlaMapsClient } from '../OlaMapsClient';

const jsonResponse = (body: unknown) => ({
  ok: true,
  status: 200,
  headers: { get: () => 'application/json' },
  json: jest.fn().mockResolvedValue(body),
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
});

const fetchMock = global.fetch as jest.Mock;

describe('API endpoint construction', () => {
  let client: OlaMapsClient;

  beforeEach(() => {
    client = new OlaMapsClient({ apiKey: 'test-key' });
    fetchMock.mockResolvedValue(jsonResponse({ status: 'ok', data: [] }));
  });

  it('uses verified Places endpoints', async () => {
    await client.places.addressValidation('Bengaluru');
    expect(fetchMock.mock.calls[0][0]).toContain(
      '/places/v1/addressvalidation'
    );
    expect(fetchMock.mock.calls[0][0]).toContain('address=Bengaluru');

    await client.elevation.getElevation(12.9, 77.6);
    expect(fetchMock.mock.calls[1][0]).toContain('/places/v1/elevation');
    expect(fetchMock.mock.calls[1][0]).toContain('location=12.9%2C77.6');
  });

  it('uses POST for directions and verified route optimizer params', async () => {
    await client.routing.getDirections('12.9,77.6', '13.0,77.7', {
      steps: true,
      traffic_metadata: false,
      mode: 'driving',
    });
    expect(fetchMock.mock.calls[0][0]).toContain('/routing/v1/directions');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');

    await client.routing.routeOptimizer(['12.9,77.6', '13.0,77.7'], {
      roundTrip: true,
    });
    const optimizerUrl = fetchMock.mock.calls[1][0] as string;
    expect(optimizerUrl).toContain('/routing/v1/routeOptimizer');
    expect(optimizerUrl).toContain('locations=12.9%2C77.6%7C13.0%2C77.7');
    expect(optimizerUrl).toContain('round_trip=true');
  });

  it('uses verified roads params', async () => {
    await client.roads.snapToRoad([{ latitude: 12.9, longitude: 77.6 }], true);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/routing/v1/snapToRoad');
    expect(url).toContain('enhancePath=true');
  });

  it('throws normalized API errors', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: jest.fn().mockResolvedValue({ error: 'unauthorized' }),
      text: jest.fn(),
    });

    await expect(client.places.geocode('Bengaluru')).rejects.toMatchObject({
      code: 'API_ERROR',
      status: 401,
    });
  });
});

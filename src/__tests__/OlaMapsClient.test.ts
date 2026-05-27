import { OlaMapsClient, OlaMapsError, VERSION } from '../index';

describe('OlaMapsClient', () => {
  it('creates all API namespaces', () => {
    const client = new OlaMapsClient({ apiKey: 'test-key' });

    expect(client.places).toBeDefined();
    expect(client.routing).toBeDefined();
    expect(client.roads).toBeDefined();
    expect(client.geofencing).toBeDefined();
    expect(client.elevation).toBeDefined();
    expect(client.tiles).toBeDefined();
    expect(OlaMapsClient.VERSION).toBe(VERSION);
  });

  it('requires an API key', () => {
    expect(() => new OlaMapsClient({ apiKey: '' })).toThrow(OlaMapsError);
  });
});

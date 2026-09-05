import { IndiaMapsClient, IndiaMapsError, VERSION } from '../index';

describe('IndiaMapsClient', () => {
  it('creates all API namespaces', () => {
    const client = new IndiaMapsClient({ accessToken: 'test-token' });

    expect(client.places).toBeDefined();
    expect(client.routing).toBeDefined();
    expect(client.roads).toBeDefined();
    expect(client.geofencing).toBeDefined();
    expect(client.elevation).toBeDefined();
    expect(client.tiles).toBeDefined();
    expect(IndiaMapsClient.VERSION).toBe(VERSION);
  });

  it('allows map-only usage without an access token', () => {
    expect(() => new IndiaMapsClient()).not.toThrow(IndiaMapsError);
  });
});

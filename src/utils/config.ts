import type { IndiaMapsConfig } from '../types/common';

/**
 * Returns the effective access token for a config, preferring
 * `accessToken` over the `apiKey` alias.
 */
export function resolveAccessToken(
  config: IndiaMapsConfig
): string | undefined {
  return config.accessToken ?? config.apiKey;
}

/**
 * Returns the base URL for search and geocoding endpoints, falling back to
 * the provider default when `baseUrl` is unset.
 */
export function resolveBaseUrl(config: IndiaMapsConfig): string {
  if (config.baseUrl) {
    return config.baseUrl;
  }
  return config.provider === 'mappls'
    ? 'https://atlas.mappls.com'
    : 'https://api.olamaps.io';
}

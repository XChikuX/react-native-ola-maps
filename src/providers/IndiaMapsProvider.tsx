import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { IndiaMapsClient } from '../IndiaMapsClient';
import type { IndiaMapsConfig } from '../types/common';
import { resolveAccessToken } from '../utils/config';

/** Value exposed by {@linkcode IndiaMapsContext}. */
export type IndiaMapsContextValue = {
  /** Shared SDK client used by hooks and components. */
  client: IndiaMapsClient;

  /** Effective access token from the config. */
  accessToken?: string;
};

export const IndiaMapsContext = createContext<
  IndiaMapsContextValue | undefined
>(undefined);

/** Props for {@linkcode IndiaMapsProvider}. */
export type IndiaMapsProviderProps = IndiaMapsConfig & {
  /** Preconfigured client; takes precedence over inline config fields. */
  client?: IndiaMapsClient;

  children: ReactNode;
};

/**
 * Provides a shared {@linkcode IndiaMapsClient} to hooks and components.
 * Pass either a `client` or inline config fields (`apiKey`, `accessToken`,
 * `provider`, base-URL overrides).
 *
 * @example
 * <IndiaMapsProvider apiKey="YOUR_OLA_MAPS_API_KEY">
 *   <App />
 * </IndiaMapsProvider>
 */
export function IndiaMapsProvider({
  client,
  children,
  ...config
}: IndiaMapsProviderProps) {
  const {
    accessToken,
    apiKey,
    provider,
    baseUrl,
    searchBaseUrl,
    routeBaseUrl,
    sdkBaseUrl,
    tileBaseUrl,
  } = config;

  const value = useMemo<IndiaMapsContextValue>(() => {
    const resolvedClient =
      client ??
      new IndiaMapsClient({
        accessToken,
        apiKey,
        provider,
        baseUrl,
        searchBaseUrl,
        routeBaseUrl,
        sdkBaseUrl,
        tileBaseUrl,
      });
    return {
      client: resolvedClient,
      accessToken: resolveAccessToken(config),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accessToken,
    apiKey,
    provider,
    baseUrl,
    searchBaseUrl,
    routeBaseUrl,
    sdkBaseUrl,
    tileBaseUrl,
    client,
  ]);

  return (
    <IndiaMapsContext.Provider value={value}>
      {children}
    </IndiaMapsContext.Provider>
  );
}

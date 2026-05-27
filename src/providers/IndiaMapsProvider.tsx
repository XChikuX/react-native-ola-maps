import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { IndiaMapsClient } from '../IndiaMapsClient';
import type { IndiaMapsConfig } from '../types/common';

export type IndiaMapsContextValue = {
  client: IndiaMapsClient;
  accessToken?: string;
};

export const IndiaMapsContext = createContext<
  IndiaMapsContextValue | undefined
>(undefined);

export type IndiaMapsProviderProps = IndiaMapsConfig & {
  client?: IndiaMapsClient;
  children: ReactNode;
};

export function IndiaMapsProvider({
  accessToken,
  apiKey,
  searchBaseUrl,
  routeBaseUrl,
  sdkBaseUrl,
  tileBaseUrl,
  client,
  children,
}: IndiaMapsProviderProps) {
  const value = useMemo(() => {
    const resolvedClient =
      client ??
      new IndiaMapsClient({
        accessToken,
        apiKey,
        searchBaseUrl,
        routeBaseUrl,
        sdkBaseUrl,
        tileBaseUrl,
      });
    return { client: resolvedClient, accessToken: accessToken ?? apiKey };
  }, [
    accessToken,
    apiKey,
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

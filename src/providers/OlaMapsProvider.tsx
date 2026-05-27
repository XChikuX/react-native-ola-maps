import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { OlaMapsClient } from '../OlaMapsClient';
import type { OlaMapsConfig } from '../types/common';

export type OlaMapsContextValue = {
  client: OlaMapsClient;
  apiKey: string;
};

export const OlaMapsContext = createContext<OlaMapsContextValue | undefined>(
  undefined
);

export type OlaMapsProviderProps = OlaMapsConfig & {
  client?: OlaMapsClient;
  children: ReactNode;
};

export function OlaMapsProvider({
  apiKey,
  baseUrl,
  client,
  children,
}: OlaMapsProviderProps) {
  const value = useMemo(() => {
    const resolvedClient = client ?? new OlaMapsClient({ apiKey, baseUrl });
    return { client: resolvedClient, apiKey };
  }, [apiKey, baseUrl, client]);

  return (
    <OlaMapsContext.Provider value={value}>{children}</OlaMapsContext.Provider>
  );
}

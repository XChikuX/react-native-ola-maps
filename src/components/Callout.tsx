import type { ComponentType } from 'react';
import { loadMapplsMapSdk } from '../mappls/loaders';

export type CalloutProps = Record<string, unknown>;

export function Callout(props: CalloutProps) {
  const sdk = loadMapplsMapSdk() as {
    Callout: ComponentType<Record<string, unknown>>;
  };
  const NativeCallout = sdk.Callout;
  return <NativeCallout {...props} />;
}

import { Callout as MapLibreCallout } from '@maplibre/maplibre-react-native';

export type CalloutProps = Record<string, unknown>;

export function Callout(props: CalloutProps) {
  return <MapLibreCallout {...props} />;
}

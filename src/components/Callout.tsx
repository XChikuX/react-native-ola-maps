import MapLibreGL from '@maplibre/maplibre-react-native';

export type CalloutProps = Record<string, unknown>;

export function Callout(props: CalloutProps) {
  return <MapLibreGL.Callout {...props} />;
}

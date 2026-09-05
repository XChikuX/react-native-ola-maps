import type { ComponentProps } from 'react';
import { Callout as MapLibreCallout } from '@maplibre/maplibre-react-native';

/** Props for {@linkcode Callout}, passthrough to the MapLibre callout. */
export type CalloutProps = ComponentProps<typeof MapLibreCallout>;

/** Info callout displayed for a selected annotation, backed by MapLibre. */
export function Callout(props: CalloutProps) {
  return <MapLibreCallout {...props} />;
}

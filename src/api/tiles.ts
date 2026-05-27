import type { IndiaMapsConfig } from '../types/common';
import { resolveAccessToken } from '../types/common';
import type { MapOptions, MapStyle, StaticMapOptions } from '../types/tiles';

const DEFAULT_TILE_BASE_URL = 'https://tile.mappls.com';
const DEFAULT_STYLE: MapStyle = 'standard';

export class TilesApi {
  private readonly accessToken?: string;
  private readonly tileBaseUrl: string;

  constructor(config: IndiaMapsConfig) {
    this.accessToken = resolveAccessToken(config);
    this.tileBaseUrl = config.tileBaseUrl ?? DEFAULT_TILE_BASE_URL;
  }

  getStyleName(styleName?: MapStyle): string {
    return styleName ?? DEFAULT_STYLE;
  }

  getMapOptions(options?: MapOptions): {
    mapplsStyle: string;
    centerCoordinate?: [number, number];
    zoomLevel?: number;
    bearing?: number;
    pitch?: number;
  } {
    return {
      mapplsStyle: this.getStyleName(options?.style),
      centerCoordinate: options?.center,
      zoomLevel: options?.zoom ?? 12,
      bearing: options?.bearing ?? 0,
      pitch: options?.pitch ?? 0,
    };
  }

  getStaticMapURL(options: StaticMapOptions): string {
    if (!this.accessToken) {
      throw new Error(
        'TilesApi.getStaticMapURL requires accessToken (or apiKey alias) in IndiaMapsClient config.'
      );
    }

    const url = new URL('/map/raster_tile/still_image', this.tileBaseUrl);
    const center = 'center' in options ? options.center : undefined;
    if (!center) {
      throw new Error(
        'Mappls still image API requires a center coordinate. bbox/auto are not supported here.'
      );
    }

    url.searchParams.set('center', `${center[1]},${center[0]}`);
    url.searchParams.set('zoom', String(options.zoom));
    url.searchParams.set('size', `${options.width}x${options.height}`);
    url.searchParams.set(
      'ssf',
      options.scaleFactor ? String(options.scaleFactor) : '1'
    );
    options.markers?.forEach((marker) =>
      url.searchParams.append('markers', marker)
    );
    if (options.markerIcon) {
      url.searchParams.set('markers_icon', options.markerIcon);
    }
    url.searchParams.set('access_token', this.accessToken);
    return url.toString();
  }

  getStyleURL(styleName?: MapStyle): string {
    return this.getStyleName(styleName);
  }
}

import type { IndiaMapsConfig } from '../types/common';
import { resolveAccessToken } from '../types/common';
import type {
  MapOptions,
  MapStyle,
  StaticMapOptions,
  TransformRequest,
} from '../types/tiles';

const OLA_TILE_BASE_URL = 'https://api.olamaps.io';
const MAPPLS_TILE_BASE_URL = 'https://tile.mappls.com';
const DEFAULT_STYLE: MapStyle = 'default-light-standard';

export class TilesApi {
  private readonly accessToken?: string;
  private readonly tileBaseUrl: string;
  private readonly provider: 'ola' | 'mappls';

  constructor(config: IndiaMapsConfig) {
    this.accessToken = resolveAccessToken(config);
    this.provider = config.provider ?? 'ola';
    this.tileBaseUrl =
      config.tileBaseUrl ??
      (this.provider === 'mappls' ? MAPPLS_TILE_BASE_URL : OLA_TILE_BASE_URL);
  }

  getStyleName(styleName?: MapStyle): string {
    return styleName ?? DEFAULT_STYLE;
  }

  /**
   * Returns a MapLibre-compatible style URL for the given style name.
   * For Ola Maps: https://api.olamaps.io/tiles/vector/v1/styles/{style}/style.json
   * For Mappls: returns the style name (Mappls uses native SDK rendering)
   */
  getStyleURL(styleName?: MapStyle): string {
    const style = this.getStyleName(styleName);
    if (this.provider === 'mappls') {
      return style;
    }
    const url = new URL(
      `/tiles/vector/v1/styles/${style}/style.json`,
      this.tileBaseUrl
    );
    if (this.accessToken) {
      url.searchParams.set('api_key', this.accessToken);
    }
    return url.toString();
  }

  /**
   * Returns a transform request function for MapLibre that appends the API key
   * to all tile requests. Used with MapView's `requestTransformFn` or similar.
   */
  getTransformRequest(): (url: string) => TransformRequest {
    const apiKey = this.accessToken;
    return (url: string): TransformRequest => {
      if (apiKey && url.includes('olamaps.io')) {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.set('api_key', apiKey);
        return { url: parsedUrl.toString() };
      }
      return { url };
    };
  }

  getMapOptions(options?: MapOptions): {
    styleURL: string;
    centerCoordinate?: [number, number];
    zoomLevel?: number;
    bearing?: number;
    pitch?: number;
  } {
    return {
      styleURL: this.getStyleURL(options?.style),
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

    if (this.provider === 'mappls') {
      return this.getMapplsStaticMapURL(options);
    }

    return this.getOlaStaticMapURL(options);
  }

  private getOlaStaticMapURL(options: StaticMapOptions): string {
    const center = 'center' in options ? options.center : undefined;
    if (!center) {
      throw new Error('Static map API requires a center coordinate.');
    }
    const url = new URL('/tiles/v1/styles/default/static', this.tileBaseUrl);
    url.searchParams.set('center', `${center[1]},${center[0]}`);
    url.searchParams.set('zoom', String(options.zoom));
    url.searchParams.set('size', `${options.width}x${options.height}`);
    if (options.markers?.length) {
      url.searchParams.set('markers', options.markers.join('|'));
    }
    url.searchParams.set('api_key', this.accessToken!);
    return url.toString();
  }

  private getMapplsStaticMapURL(options: StaticMapOptions): string {
    const center = 'center' in options ? options.center : undefined;
    if (!center) {
      throw new Error('Static map API requires a center coordinate.');
    }
    const url = new URL('/map/raster_tile/still_image', this.tileBaseUrl);
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
    url.searchParams.set('access_token', this.accessToken!);
    return url.toString();
  }
}

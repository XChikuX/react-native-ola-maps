import type { OlaMapsConfig } from '../types/common';
import type {
  MapOptions,
  MapStyle,
  StaticMapOptions,
  TransformRequest,
} from '../types/tiles';

const DEFAULT_BASE_URL = 'https://api.olamaps.io';
const DEFAULT_STYLE: MapStyle = 'default-light-standard';

export class TilesApi {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: OlaMapsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  getStylesURL(): string {
    return this.withApiKey(`${this.baseUrl}/tiles/vector/v1/styles.json`);
  }

  getStyleURL(styleName?: MapStyle): string {
    const style = styleName ?? DEFAULT_STYLE;
    return this.withApiKey(
      `${this.baseUrl}/tiles/vector/v1/styles/${style}/style.json`
    );
  }

  getDatasetURL(datasetName: string): string {
    return this.withApiKey(
      `${this.baseUrl}/tiles/vector/v1/data/${datasetName}.json`
    );
  }

  getVectorTileURL(
    datasetName: string,
    z: number,
    x: number,
    y: number
  ): string {
    return this.withApiKey(
      `${this.baseUrl}/tiles/vector/v1/data/${datasetName}/${z}/${x}/${y}.pbf`
    );
  }

  getFontsURL(fontstack: string, start: number, end: number): string {
    return this.withApiKey(
      `${this.baseUrl}/tiles/vector/v1/fonts/${fontstack}/${start}-${end}.pbf`
    );
  }

  get3DTilesetURL(): string {
    return this.withApiKey(
      `${this.baseUrl}/tiles/vector/v1/3dtiles/tileset.json`
    );
  }

  getStaticMapURL(options: StaticMapOptions): string {
    const style = options.style ?? DEFAULT_STYLE;
    const format = options.format ?? 'png';
    const viewport =
      'bbox' in options
        ? options.bbox.join(',')
        : 'center' in options
          ? `${options.center[0]},${options.center[1]},${options.zoom}`
          : 'auto';
    const url = new URL(
      `${this.baseUrl}/tiles/v1/styles/${style}/static/${viewport}/${options.width}x${options.height}.${format}`
    );
    url.searchParams.set('api_key', this.apiKey);
    options.markers?.forEach((marker) =>
      url.searchParams.append('marker', marker)
    );
    options.paths?.forEach((path) => url.searchParams.append('path', path));
    return url.toString();
  }

  getTransformRequest(): (url: string) => TransformRequest {
    return (url: string) => ({ url: this.withApiKey(url) });
  }

  getMapOptions(options?: MapOptions): {
    mapStyle: string;
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
  } {
    return {
      mapStyle: this.getStyleURL(options?.style),
      center: options?.center,
      zoom: options?.zoom ?? 12,
      bearing: options?.bearing ?? 0,
      pitch: options?.pitch ?? 0,
    };
  }

  private withApiKey(url: string): string {
    if (!url.includes('api.olamaps.io') || url.includes('api_key=')) {
      return url;
    }
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}api_key=${encodeURIComponent(this.apiKey)}`;
  }
}

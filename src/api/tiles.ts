import type { OlaMapsConfig } from '../types/common';
import type { MapOptions, MapStyle, TransformRequest } from '../types/tiles';

const DEFAULT_BASE_URL = 'https://api.olamaps.io';
const DEFAULT_STYLE: MapStyle = 'default-light-standard';

export class TilesApi {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: OlaMapsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  getStyleURL(styleName?: MapStyle): string {
    const style = styleName ?? DEFAULT_STYLE;
    return `${this.baseUrl}/tiles/vector/v1/styles/${style}/style.json?api_key=${this.apiKey}`;
  }

  getTransformRequest(): (url: string) => TransformRequest {
    const apiKey = this.apiKey;
    return (url: string) => {
      if (url.includes('api.olamaps.io')) {
        const separator = url.includes('?') ? '&' : '?';
        return { url: `${url}${separator}api_key=${apiKey}` };
      }
      return { url };
    };
  }

  getMapOptions(options?: MapOptions): {
    styleURL: string;
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
  } {
    return {
      styleURL: this.getStyleURL(options?.style),
      center: options?.center,
      zoom: options?.zoom ?? 12,
      bearing: options?.bearing ?? 0,
      pitch: options?.pitch ?? 0,
    };
  }
}

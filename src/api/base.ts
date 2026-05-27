import { OlaMapsError } from '../errors';
import { VERSION } from '../version';
import type { OlaMapsConfig } from '../types/common';

const DEFAULT_BASE_URL = 'https://api.olamaps.io';

type ParamValue = string | number | boolean | undefined | null;

export type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, ParamValue>;
  body?: BodyInit | Record<string, unknown> | unknown[];
  skipJsonSerialization?: boolean;
};

export class BaseApi {
  protected readonly apiKey: string;
  protected readonly baseUrl: string;

  constructor(config: OlaMapsConfig) {
    if (!config.apiKey) {
      throw new OlaMapsError(
        'OlaMaps: apiKey is required',
        'CONFIGURATION_ERROR'
      );
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  protected buildUrl(path: string, params?: Record<string, ParamValue>): URL {
    const url = new URL(path, this.baseUrl);
    url.searchParams.set('api_key', this.apiKey);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value != null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url;
  }

  protected async request<T>(
    path: string,
    options?: RequestOptions
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params);
    const headers = new Headers(options?.headers);
    headers.set('Accept', 'application/json');
    headers.set('X-OlaMaps-RN-SDK-Version', VERSION);

    let body = options?.body;
    if (
      body != null &&
      !options?.skipJsonSerialization &&
      typeof body === 'object' &&
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer)
    ) {
      headers.set(
        'Content-Type',
        headers.get('Content-Type') ?? 'application/json'
      );
      body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers,
        body: body as BodyInit | undefined,
      });

      const contentType = response.headers.get('content-type') ?? '';
      const responseBody = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new OlaMapsError(
          `OlaMaps API error (${response.status})`,
          'API_ERROR',
          { status: response.status, response: responseBody }
        );
      }

      return responseBody as T;
    } catch (error) {
      if (error instanceof OlaMapsError) {
        throw error;
      }
      throw new OlaMapsError(
        error instanceof Error ? error.message : 'OlaMaps network error',
        'NETWORK_ERROR'
      );
    }
  }
}

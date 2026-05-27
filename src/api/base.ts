import { IndiaMapsError } from '../errors';
import { VERSION } from '../version';
import type { IndiaMapsConfig, MapProvider } from '../types/common';
import { resolveAccessToken, resolveBaseUrl } from '../types/common';

type ParamValue = string | number | boolean | undefined | null;

export type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, ParamValue>;
  body?: BodyInit | Record<string, unknown> | unknown[];
  skipJsonSerialization?: boolean;
};

export class BaseApi {
  protected readonly accessToken?: string;
  protected readonly baseUrl: string;
  protected readonly provider: MapProvider;
  protected readonly searchBaseUrl: string;
  protected readonly routeBaseUrl: string;
  protected readonly sdkBaseUrl: string;
  protected readonly tileBaseUrl: string;

  constructor(config: IndiaMapsConfig) {
    this.accessToken = resolveAccessToken(config);
    this.provider = config.provider ?? 'ola';
    this.baseUrl = resolveBaseUrl(config);
    this.searchBaseUrl =
      config.searchBaseUrl ??
      (this.provider === 'mappls'
        ? 'https://atlas.mappls.com'
        : 'https://api.olamaps.io');
    this.routeBaseUrl =
      config.routeBaseUrl ??
      (this.provider === 'mappls'
        ? 'https://apis.mappls.com'
        : 'https://api.olamaps.io');
    this.sdkBaseUrl = config.sdkBaseUrl ?? 'https://api.olamaps.io';
    this.tileBaseUrl =
      config.tileBaseUrl ??
      (this.provider === 'mappls'
        ? 'https://tile.mappls.com'
        : 'https://api.olamaps.io');
  }

  protected requireAccessToken(feature: string) {
    if (!this.accessToken) {
      throw new IndiaMapsError(
        `${feature} requires accessToken (or apiKey alias) in IndiaMapsClient config.`,
        'CONFIGURATION_ERROR'
      );
    }
    return this.accessToken;
  }

  protected buildUrl(
    path: string,
    params?: Record<string, ParamValue>,
    opts?: { baseUrl?: string; includeAccessToken?: boolean }
  ): URL {
    const rawUrl = path.startsWith('http')
      ? path
      : `${opts?.baseUrl ?? this.baseUrl}${path}`;
    const url = new URL(rawUrl);

    if (opts?.includeAccessToken !== false && this.accessToken) {
      const tokenParam =
        this.provider === 'mappls' ? 'access_token' : 'api_key';
      url.searchParams.set(tokenParam, this.accessToken);
    }

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
    options?: RequestOptions,
    opts?: { baseUrl?: string; includeAccessToken?: boolean }
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params, opts);
    const headers = new Headers(options?.headers);
    headers.set('Accept', 'application/json');
    headers.set('X-IndiaMaps-RN-SDK-Version', VERSION);

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
        throw new IndiaMapsError(
          `India Maps API error (${response.status})`,
          'API_ERROR',
          { status: response.status, response: responseBody }
        );
      }

      return responseBody as T;
    } catch (error) {
      if (error instanceof IndiaMapsError) {
        throw error;
      }
      throw new IndiaMapsError(
        error instanceof Error ? error.message : 'India Maps network error',
        'NETWORK_ERROR'
      );
    }
  }
}

import type { OlaMapsConfig } from '../types/common';

const DEFAULT_BASE_URL = 'https://api.olamaps.io';

export class BaseApi {
  protected readonly apiKey: string;
  protected readonly baseUrl: string;

  constructor(config: OlaMapsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  }

  protected async request<T>(
    path: string,
    options?: RequestInit & { params?: Record<string, string | undefined> }
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    url.searchParams.set('api_key', this.apiKey);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value != null) {
          url.searchParams.set(key, value);
        }
      }
    }

    const { params: _params, ...fetchOptions } = options ?? {};
    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OlaMaps API error (${response.status}): ${errorText}`
      );
    }

    return response.json() as Promise<T>;
  }
}

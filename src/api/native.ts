import { IndiaMapsError } from '../errors';
import { loadMapplsMapSdk } from '../mappls/loaders';

const wrapError = (error: unknown) => {
  if (error instanceof IndiaMapsError) {
    return error;
  }
  return new IndiaMapsError(
    error instanceof Error ? error.message : 'Mappls SDK request failed',
    'API_ERROR',
    { response: error }
  );
};

export const callMapplsRestApi = async <T>(
  method: string,
  params: Record<string, unknown>
): Promise<T> => {
  const sdk = loadMapplsMapSdk() as {
    RestApi?: Record<string, (args: Record<string, unknown>) => Promise<T>>;
  };
  const fn = sdk.RestApi?.[method];

  if (typeof fn !== 'function') {
    throw new IndiaMapsError(
      `mappls-map-react-native does not expose RestApi.${method}.`,
      'UNSUPPORTED_ERROR'
    );
  }

  try {
    return await fn(params);
  } catch (error) {
    throw wrapError(error);
  }
};

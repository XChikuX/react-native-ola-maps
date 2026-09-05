import { useContext } from 'react';
import { IndiaMapsContext } from '../providers/IndiaMapsProvider';

/**
 * Returns the shared {@linkcode IndiaMapsClient} from the enclosing
 * {@linkcode IndiaMapsProvider}.
 *
 * @throws When used outside an {@linkcode IndiaMapsProvider}.
 */
export function useIndiaMaps() {
  const context = useContext(IndiaMapsContext);
  if (!context) {
    throw new Error('useIndiaMaps must be used within an IndiaMapsProvider');
  }
  return context.client;
}

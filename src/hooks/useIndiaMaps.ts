import { useContext } from 'react';
import { IndiaMapsContext } from '../providers/IndiaMapsProvider';

export function useIndiaMaps() {
  const context = useContext(IndiaMapsContext);
  if (!context) {
    throw new Error('useIndiaMaps must be used within an IndiaMapsProvider');
  }
  return context.client;
}

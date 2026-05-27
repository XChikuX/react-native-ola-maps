import { useContext } from 'react';
import { OlaMapsContext } from '../providers/OlaMapsProvider';

export function useOlaMaps() {
  const context = useContext(OlaMapsContext);
  if (!context) {
    throw new Error('useOlaMaps must be used within an OlaMapsProvider');
  }
  return context.client;
}

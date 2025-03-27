import { client, queries } from '../../../server/lib/sanity';

// Only cache read-only queries that don't need real-time updates
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Selective caching based on query type
async function selectiveCachedFetch<T>(key: string, fetcher: () => Promise<T>, shouldCache = false): Promise<T> {
  if (!shouldCache) {
    return fetcher();
  }

  const now = Date.now();
  const cached = cache.get(key) as CacheEntry<T> | undefined;
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  const result = await fetcher();
  cache.set(key, { data: result, timestamp: now });
  return result;
}

export const dataProvider = {
  // Real-time queries (no caching)
  getLetters: () => client.fetch(queries.getLetters),
  getRecentContent: () => client.fetch(queries.getRecentContent),
  getAudioMessages: () => client.fetch(queries.getAudioMessages),
  
  // Cached queries (static content)
  getLandingPage: () => selectiveCachedFetch('landingPage', () => client.fetch(queries.getLandingPage), true),
  getFeaturedItems: () => selectiveCachedFetch('featuredItems', () => client.fetch(queries.getFeaturedItems), true),
  
  // Real-time queries with params
  getAlbums: (params = {}) => client.fetch(queries.getAlbums, params),
  getGalleryItems: (params = {}) => client.fetch(queries.getGalleryItems, params),
};

import { Cache } from 'cache-manager';

export const ITINERARY_CACHE_KEY: string = 'itineraries';

export const itinerariesCacheKeyStore: Set<string> = new Set();

export const invalidateItinerariesCache = async (
  cacheManager: Cache,
  params?: string,
) => {
  console.log(itinerariesCacheKeyStore);
  for (const key of itinerariesCacheKeyStore) {
    const haveKey = key.startsWith(
      `${ITINERARY_CACHE_KEY}:/api/v1/itineraries/${params}`,
    );
    if (haveKey) {
      console.log('cache removed : ', key);
      await cacheManager.del(key);
      itinerariesCacheKeyStore.delete(key);
    }
  }
};

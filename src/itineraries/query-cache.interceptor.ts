import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import {
  itinerariesCacheKeyStore,
  ITINERARY_CACHE_KEY,
} from './itineraries.util';

@Injectable()
export class QueryCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (request.method !== 'GET') {
      return undefined;
    }

    let key = `${ITINERARY_CACHE_KEY}:` + (request.routerPath || request.url);

    const queryParams = request.query as Record<string, any>;

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = Object.entries(queryParams)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

      key += `${key}?${queryString}`;
    }

    itinerariesCacheKeyStore.add(key);

    return key;
  }
}

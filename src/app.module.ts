import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BucketListModule } from './bucket-list/bucket-list.module';
import { DatabaseModule } from './database/database.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { MarketPlaceModule } from './market-place/market-place.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // default cache time (in seconds)
      max: 1000, // max items (memory store only)
      isGlobal: true, // available everywhere}),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ItinerariesModule,
    BucketListModule,
    MarketPlaceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}

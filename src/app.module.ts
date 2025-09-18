import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BucketListModule } from './bucket-list/bucket-list.module';
import { EarningsModule } from './creator/earnings/earnings.module';
import { StatsModule } from './creator/stats/stats.module';
import { DatabaseModule } from './database/database.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { MarketPlaceModule } from './market-place/market-place.module';
import { QuoteRequestsModule } from './quote-requests/quote-requests.module';
import { SubscriptionPlanModule } from './subscription-plan/subscription-plan.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 1000,
      isGlobal: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ItinerariesModule,
    BucketListModule,
    MarketPlaceModule,
    SubscriptionPlanModule,
    TemplatesModule,
    AuthModule,
    QuoteRequestsModule,
    EarningsModule,
    StatsModule,
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

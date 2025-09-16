import { Module } from '@nestjs/common';
import { BucketListService } from './bucket-list.service';
import { BucketListController } from './bucket-list.controller';

@Module({
  controllers: [BucketListController],
  providers: [BucketListService],
})
export class BucketListModule {}

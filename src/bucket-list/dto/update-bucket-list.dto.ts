import { PartialType } from '@nestjs/mapped-types';
import { CreateBucketListDto } from './create-bucket-list.dto';

export class UpdateBucketListDto extends PartialType(CreateBucketListDto) {}

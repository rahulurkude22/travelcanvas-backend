import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BucketListService } from './bucket-list.service';
import { CreateBucketListDto } from './dto/create-bucket-list.dto';
import { UpdateBucketListDto } from './dto/update-bucket-list.dto';

@Controller('bucket-list')
export class BucketListController {
  constructor(private readonly bucketListService: BucketListService) {}

  @Post()
  create(@Body() createBucketListDto: CreateBucketListDto) {
    return this.bucketListService.create(createBucketListDto);
  }

  @Get()
  findAll() {
    return this.bucketListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bucketListService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBucketListDto: UpdateBucketListDto,
  ) {
    return this.bucketListService.update(+id, updateBucketListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bucketListService.remove(id);
  }
}

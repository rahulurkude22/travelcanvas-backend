import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from 'nest-utils/decorators/auth/user.decorator';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItinerariesSearchDto } from './dto/itineraries-search.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { ItinerariesService } from './itineraries.service';
import { Public } from 'nest-utils/decorators/public/public.decorator';

@Controller('/itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Post()
  create(
    @User('sub') userId: string,
    @Body() createItineraryDto: CreateItineraryDto,
  ) {
    return this.itinerariesService.create(userId, createItineraryDto);
  }

  @Public()
  @Get()
  findAll(
    @User('sub') userId: string,
    @Query() queryParams: ItinerariesSearchDto,
  ) {
    console.log(`findAll method executed${Date.now()}`);
    return this.itinerariesService.findAll(userId, queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(`findOne method executed${Date.now()}`);
    return this.itinerariesService.findOne(id);
  }

  @Patch(':id')
  update(
    @User('sub') userId: string,
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itinerariesService.update(userId, id, updateItineraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itinerariesService.remove(+id);
  }
}

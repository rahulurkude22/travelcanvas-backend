import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { ItinerariesSearchDto } from './dto/itineraries-search.dto';

@Controller('/itineraries')
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Post()
  create(@Body() createItineraryDto: CreateItineraryDto) {
    return this.itinerariesService.create(createItineraryDto);
  }

  @Get()
  findAll(@Query() queryParams: ItinerariesSearchDto) {
    return this.itinerariesService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itinerariesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItineraryDto: UpdateItineraryDto,
  ) {
    return this.itinerariesService.update(id, updateItineraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itinerariesService.remove(id);
  }
}

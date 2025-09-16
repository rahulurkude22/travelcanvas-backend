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
import { MarketPlaceService } from './market-place.service';
import { CreateMarketPlaceDto } from './dto/create-market-place.dto';
import { UpdateMarketPlaceDto } from './dto/update-market-place.dto';
import { MarketPlaceSearchParams } from './dto/market-place-searchparams.dto';

@Controller('marketplace')
export class MarketPlaceController {
  constructor(private readonly marketPlaceService: MarketPlaceService) {}

  @Post()
  create(@Body() createMarketPlaceDto: CreateMarketPlaceDto) {
    return this.marketPlaceService.create(createMarketPlaceDto);
  }

  @Get()
  findAll(@Query() marketPlaceSearchParams: MarketPlaceSearchParams) {
    return this.marketPlaceService.findAll(marketPlaceSearchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketPlaceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketPlaceDto: UpdateMarketPlaceDto,
  ) {
    return this.marketPlaceService.update(+id, updateMarketPlaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketPlaceService.remove(+id);
  }
}

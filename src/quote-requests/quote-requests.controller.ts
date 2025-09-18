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
import { QuoteRequestsService } from './quote-requests.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { UpdateQuoteRequestDto } from './dto/update-quote-request.dto';
import { QuoteRequestsSearchParms } from './dto/search-params.dto';

@Controller('quote-requests')
export class QuoteRequestsController {
  constructor(private readonly quoteRequestsService: QuoteRequestsService) {}

  @Post()
  create(@Body() createQuoteRequestDto: CreateQuoteRequestDto) {
    return this.quoteRequestsService.create(createQuoteRequestDto);
  }

  @Get()
  findAll(@Query() queryParams: QuoteRequestsSearchParms) {
    return this.quoteRequestsService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quoteRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuoteRequestDto: UpdateQuoteRequestDto,
  ) {
    return this.quoteRequestsService.update(+id, updateQuoteRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quoteRequestsService.remove(+id);
  }
}

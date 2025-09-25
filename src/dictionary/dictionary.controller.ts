import { Controller, Get } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';

@Controller('metadata')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}
  @Get()
  getAllMetaData() {
    return this.dictionaryService.getAllMetaData();
  }
}

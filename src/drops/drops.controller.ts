import { Body, Controller, Post } from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';

@Controller('drops')
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  createDrop(@Body() createDropDto: CreateDropDto) {
    return this.dropsService.createDrop(createDropDto);
  }
}

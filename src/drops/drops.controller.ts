import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';

@Controller('drops')
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  createDrop(@Body() createDropDto: CreateDropDto) {
    return this.dropsService.createDrop(createDropDto);
  }

  @Patch('/:id')
  updateDrop(
    @Param() dropIdDto: DropIdDto,
    @Body() updateDropDto: UpdateDropDto,
  ) {
    return this.dropsService.updateDrop(dropIdDto, updateDropDto);
  }

  @Delete('/:id')
  deleteDrop(@Param() dropIdDto: DropIdDto): Promise<void> {
    return this.dropsService.deleteDrop(dropIdDto);
  }
}

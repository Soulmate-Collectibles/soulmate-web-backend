import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { AuthGuard } from '@nestjs/passport';
import { Drop } from './drop.entity';

@Controller('drops')
// @UseGuards(AuthGuard())
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  create(@Body() createDropDto: CreateDropDto): Promise<Drop> {
    const {
      title,
      description,
      image,
      startDate,
      endDate,
      totalAmount,
      creatorAddress,
    } = createDropDto;
    return this.dropsService.create(
      title,
      description,
      image,
      startDate,
      endDate,
      totalAmount,
      creatorAddress,
    );
  }

  @Patch('/:id')
  update(
    @Param() dropIdDto: DropIdDto,
    @Body() updateDropDto: UpdateDropDto,
  ): Promise<void> {
    const { id } = dropIdDto;
    const { title, description, image } = updateDropDto;
    return this.dropsService.update(id, title, description, image);
  }

  @Delete('/:id')
  delete(@Param() dropIdDto: DropIdDto): Promise<void> {
    const { id } = dropIdDto;
    return this.dropsService.delete(id);
  }
}

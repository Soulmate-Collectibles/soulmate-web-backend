import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { Drop } from './drop.entity';
import { GetUser } from 'src/auth/auth/get-user.decorator';
import { User } from 'src/auth/users/user.entity';

@Controller('drops')
@UseGuards(AuthGuard())
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  create(
    @Body() createDropDto: CreateDropDto,
    @GetUser() user: User,
  ): Promise<Drop> {
    const { title, description, image, startDate, endDate, totalAmount } =
      createDropDto;
    const { address } = user;
    return this.dropsService.create(
      title,
      description,
      image,
      startDate,
      endDate,
      totalAmount,
      address,
    );
  }

  @Patch('/:id')
  update(
    @Param() dropIdDto: DropIdDto,
    @Body() updateDropDto: UpdateDropDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { id } = dropIdDto;
    const { title, description, image } = updateDropDto;
    const { address } = user;
    return this.dropsService.update(id, title, description, image, address);
  }

  @Delete('/:id')
  delete(@Param() dropIdDto: DropIdDto, @GetUser() user: User): Promise<void> {
    const { id } = dropIdDto;
    const { address } = user;
    return this.dropsService.delete(id, address);
  }
}

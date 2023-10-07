import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { DropIdDto } from './dto/drop-id.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { UserAddressDto } from '../users/dto/user-address.dto';
import { MintlinksService } from './mintlinks.service';
import { Drop } from './drop.entity';
import { Mintlink } from './mintlink.entity';

@Controller('drops')
export class DropsController {
  constructor(
    private readonly dropsService: DropsService,
    private readonly mintlinksService: MintlinksService,
  ) {}

  @Post()
  create(@Body() createDropDto: CreateDropDto): Promise<Mintlink> {
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
  update(@Param() dropIdDto: DropIdDto, @Body() updateDropDto: UpdateDropDto) {
    return this.dropsService.updateDrop(dropIdDto, updateDropDto);
  }

  @Delete('/:address')
  delete(@Param() userAddressDto: UserAddressDto): Promise<void> {
    const { address } = userAddressDto;
    // this.usersService.deleteUser(address);
    this.dropsService.deleteDropsByCreatorAddress(address);
    return;
  }

  // @Delete('/:id')
  // deleteDrop(@Param() dropIdDto: DropIdDto): Promise<void> {
  //   return this.dropsService.deleteDrop(dropIdDto);
  // }
}

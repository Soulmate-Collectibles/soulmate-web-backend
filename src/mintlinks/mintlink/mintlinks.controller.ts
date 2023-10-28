import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MintlinksService } from './mintlinks.service';
import { Mintlink } from './mintlink.entity';
import { UpdateMintlinkDto } from './dto/update-mintlink.dto';
import { UUIDDto } from '../../drops/dto/uuid.dto';
import { GetUser } from '../../auth/auth/get-user.decorator';
import { User } from '../../auth/users/user.entity';
import { UserAddressDto } from 'src/auth/users/dto/user-address.dto';

@Controller('mintlinks')
export class MintlinksController {
  constructor(private readonly mintlinksService: MintlinksService) {}

  @Patch('/:id')
  async update(
    @Param() uuidDto: UUIDDto,
    @Body() updateMintlinkDto: UpdateMintlinkDto,
  ): Promise<void> {
    const { id } = uuidDto;
    const { remainingUses } = updateMintlinkDto;
    return await this.mintlinksService.update(id, remainingUses);
  }

  @UseGuards(AuthGuard())
  @Get('/:id')
  async getOne(
    @Param() uuidDto: UUIDDto,
    @GetUser() user: User,
  ): Promise<Mintlink> {
    const { id } = uuidDto;
    const { address } = user;
    return await this.mintlinksService.getOneFull(id, address);
  }

  @Post('/:id/mint')
  async mint(
    @Param() uuidDto: UUIDDto,
    @Body() userAddressDto: UserAddressDto,
  ) {
    const { id: mintlinkId } = uuidDto;
    const { address: receiverAddress } = userAddressDto;
    return await this.mintlinksService.mint(mintlinkId, receiverAddress);
  }
}

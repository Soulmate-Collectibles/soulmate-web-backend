import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MintlinksService } from './mintlinks.service';
import { Mintlink } from './mintlink.entity';
import { UpdateMintlinkDto } from './dto/update-mintlink.dto';
import { UUIDDto } from '../drops/dto/uuid.dto';
import { GetUser } from '../auth/auth/get-user.decorator';
import { User } from '../auth/users/user.entity';

@Controller('mintlinks')
export class MintlinksController {
  constructor(private readonly mintlinksService: MintlinksService) {}

  @Patch('/:id')
  update(
    @Param() uuidDto: UUIDDto,
    @Body() updateMintlinkDto: UpdateMintlinkDto,
  ): Promise<void> {
    const { id } = uuidDto;
    const { remainingUses } = updateMintlinkDto;
    return this.mintlinksService.update(id, remainingUses);
  }

  @UseGuards(AuthGuard())
  @Get('/:id')
  getOne(@Param() uuidDto: UUIDDto, @GetUser() user: User): Promise<Mintlink> {
    const { id } = uuidDto;
    const { address } = user;
    return this.mintlinksService.getOneFull(id, address);
  }
}

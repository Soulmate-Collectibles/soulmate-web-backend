import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { MintlinksService } from './mintlinks.service';
import { UpdateMintlinkDto } from './dto/update-mintlink.dto';
import { Mintlink } from './mintlink.entity';
import { UUIDDto } from '../drops/dto/uuid.dto';
import { AuthGuard } from '@nestjs/passport';

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
  getOne(@Param() uuidDto: UUIDDto): Promise<Mintlink> {
    const { id } = uuidDto;
    return this.mintlinksService.getOneFull(id);
  }
}

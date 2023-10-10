import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { MintlinksService } from './mintlinks.service';
import { UUIDDto } from './dto/uuid.dto';
import { UpdateMintlinkDto } from './dto/update-mintlink.dto';

@Controller('mintlinks')
export class MintlinksController {
  constructor(private readonly mintlinksService: MintlinksService) {}

  @Patch('/:id')
  update(
    @Param() uuidDto: UUIDDto,
    @Body() updateMintlinkDto: UpdateMintlinkDto,
  ) {
    const { id } = uuidDto;
    const { remainingUses } = updateMintlinkDto;
    return this.mintlinksService.update(id, remainingUses);
  }

  @Get('/:id')
  getOne(@Param() uuidDto: UUIDDto) {
    const { id } = uuidDto;
    return this.mintlinksService.getOneFull(id);
  }
}

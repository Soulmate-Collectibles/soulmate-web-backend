import { Module } from '@nestjs/common';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { MintlinkService } from './mintlink.service';

@Module({
  controllers: [DropsController],
  providers: [DropsService, MintlinkService],
})
export class DropsModule {}

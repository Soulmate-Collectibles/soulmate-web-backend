import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { Drop } from './drop.entity';
import { AuthModule } from '../auth/auth.module';
import { MintlinksModule } from '../mintlinks/mintlinks.module';
import { IpfsModule } from '../ipfs/ipfs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drop]),
    AuthModule,
    MintlinksModule,
    IpfsModule,
  ],
  controllers: [DropsController],
  providers: [DropsService],
})
export class DropsModule {}

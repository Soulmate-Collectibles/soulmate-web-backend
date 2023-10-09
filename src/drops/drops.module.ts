import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { MintlinksService } from './mintlinks.service';
import { Drop } from './drop.entity';
import { Mintlink } from './mintlink.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Drop, Mintlink]), UsersModule],
  controllers: [DropsController],
  providers: [DropsService, MintlinksService],
  exports: [DropsService],
})
export class DropsModule {}

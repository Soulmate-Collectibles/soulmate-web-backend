import { Module } from '@nestjs/common';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { MintlinkService } from './mintlinks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './drop.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { Mintlink } from './mintlink.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drop, Mintlink]),
    ConfigModule,
    UsersModule,
  ],
  controllers: [DropsController],
  providers: [DropsService, MintlinkService],
})
export class DropsModule {}

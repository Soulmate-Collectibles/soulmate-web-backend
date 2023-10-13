import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';
import { Drop } from './drop.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MintlinksModule } from 'src/mintlinks/mintlinks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drop]),
    UsersModule,
    AuthModule,
    MintlinksModule,
  ],
  controllers: [DropsController],
  providers: [DropsService],
})
export class DropsModule {}

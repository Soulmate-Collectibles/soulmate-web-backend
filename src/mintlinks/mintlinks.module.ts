import { Module } from '@nestjs/common';
import { MintlinksService } from './mintlinks.service';
import { MintlinksController } from './mintlinks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mintlink } from './mintlink.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Mintlink]), AuthModule],
  controllers: [MintlinksController],
  providers: [MintlinksService],
  exports: [MintlinksService],
})
export class MintlinksModule {}

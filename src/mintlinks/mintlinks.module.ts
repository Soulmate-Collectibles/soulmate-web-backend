import { Module } from '@nestjs/common';
import { MintlinksService } from './mintlink/mintlinks.service';
import { MintlinksController } from './mintlink/mintlinks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mintlink } from './mintlink/mintlink.entity';
import { AuthModule } from '../auth/auth.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { ContractService } from './contract/contract.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Mintlink]),
    AuthModule,
    IpfsModule,
  ],
  controllers: [MintlinksController],
  providers: [MintlinksService, ContractService],
  exports: [MintlinksService],
})
export class MintlinksModule {}

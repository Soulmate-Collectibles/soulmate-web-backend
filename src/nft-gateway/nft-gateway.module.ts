import { Module } from '@nestjs/common';
import { NftGatewayController } from './nft-gateway.controller';
import { NftGatewayService } from './nft-gateway.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [NftGatewayController],
  providers: [NftGatewayService],
})
export class NftGatewayModule {}

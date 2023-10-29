import { Controller, Get, UseGuards } from '@nestjs/common';
import { NftGatewayService } from './nft-gateway.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/auth/get-user.decorator';
import { User } from '../auth/users/user.entity';

@Controller('nft-gateway')
@UseGuards(AuthGuard())
export class NftGatewayController {
  constructor(private readonly gatewayService: NftGatewayService) {}

  @Get()
  async getNFTs(@GetUser() user: User) {
    const { address } = user;
    return await this.gatewayService.getNFTs(address);
  }
}

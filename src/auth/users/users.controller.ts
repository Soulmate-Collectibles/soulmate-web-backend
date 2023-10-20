import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserAddressDto } from './dto/user-address.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard())
  @Get('/:address')
  async getOne(
    @Param() userAddressDto: UserAddressDto,
    @GetUser() user: User,
  ): Promise<User> {
    const { address } = userAddressDto;
    const { address: requestUserAddress } = user;
    return await this.usersService.getOneFull(address, requestUserAddress);
  }

  @Get('/:address/nonce')
  async getOneNonce(@Param() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return await this.usersService.getOnePartial(address);
  }

  @UseGuards(AuthGuard())
  @Delete('/:address')
  async delete(
    @Param() userAddressDto: UserAddressDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { address } = userAddressDto;
    const { address: requestUserAddress } = user;
    return await this.usersService.delete(address, requestUserAddress);
  }
}

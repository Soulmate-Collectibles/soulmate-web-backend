import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UserAddressDto } from './dto/user-address.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard())
  @Get('/:address')
  getOne(@Param() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.usersService.getOneFull(address);
  }

  @Get('/:address/nonce')
  getOneNonce(@Param() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.usersService.getOnePartial(address);
  }

  @UseGuards(AuthGuard())
  @Delete('/:address')
  delete(@Param() userAddressDto: UserAddressDto): Promise<void> {
    const { address } = userAddressDto;
    return this.usersService.delete(address);
  }
}

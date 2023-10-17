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
  getOne(
    @Param() userAddressDto: UserAddressDto,
    @GetUser() user: User,
  ): Promise<User> {
    const { address } = userAddressDto;
    const { address: requestUserAddress } = user;
    return this.usersService.getOneFull(address, requestUserAddress);
  }

  @Get('/:address/nonce')
  getOneNonce(@Param() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.usersService.getOnePartial(address);
  }

  @UseGuards(AuthGuard())
  @Delete('/:address')
  delete(
    @Param() userAddressDto: UserAddressDto,
    @GetUser() user: User,
  ): Promise<void> {
    const { address } = userAddressDto;
    const { address: requestUserAddress } = user;
    return this.usersService.delete(address, requestUserAddress);
  }
}

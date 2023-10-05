import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAddressDto } from './dto/user-address.dto';
import { User } from './user.entity';
import { DropsService } from 'src/drops/drops.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:address')
  getUserByAddress(@Param() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.usersService.getFullUserByAddress(address);
  }

  // @Delete('/:address')
  // deleteUser(@Param() userAddressDto: UserAddressDto): Promise<void> {
  //   const { address } = userAddressDto;
  //   // this.usersService.deleteUser(address);
  //   this.dropsService.deleteDropsByCreatorAddress(address);
  //   return;
  // }
}

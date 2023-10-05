import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAddressDto } from './dto/user-address.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:address')
  getUserByAddress(@Param() userAddressDto: UserAddressDto): Promise<User> {
    return this.usersService.getFullUserByAddress(userAddressDto);
  }

  @Delete('/:address')
  deleteUser(@Param() userAddressDto: UserAddressDto): Promise<void> {
    return this.usersService.deleteUser(userAddressDto);
  }
}

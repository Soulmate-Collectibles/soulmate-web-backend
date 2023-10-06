import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAddressDto } from './dto/user-address.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:address')
  getOneByAddress(@Param() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.usersService.getOneByAddress(address);
  }

  @Delete('/:address')
  delete(@Param() userAddressDto: UserAddressDto): Promise<void> {
    const { address } = userAddressDto;
    return this.usersService.delete(address);
  }
}

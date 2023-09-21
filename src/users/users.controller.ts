import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAddressDto } from './dto/user-address.dto';
import { User } from './user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: UserAddressDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    return this.usersService.getUsers(filterDto);
  }

  @Get('/:address')
  getUserByAddress(@Param() userAddressDto: UserAddressDto): Promise<User> {
    return this.usersService.getUserByAddress(userAddressDto);
  }

  @Delete('/:address')
  deleteUser(@Param() userAddressDto: UserAddressDto): Promise<void> {
    return this.usersService.deleteUser(userAddressDto);
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAddressDto } from '../users/dto/user-address.dto';
import { User } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.authService.create(address);
  }
}

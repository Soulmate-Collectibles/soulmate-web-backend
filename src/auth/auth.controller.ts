import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAddressDto } from '../users/dto/user-address.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() userAddressDto: UserAddressDto): Promise<void> {
    const { address } = userAddressDto;
    return this.authService.createUser(address);
  }
}

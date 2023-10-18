import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserAddressDto } from '../users/dto/user-address.dto';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.authService.signUp(address);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): {
    access_token: string;
  } {
    const { address, message, signedMessage } = authCredentialsDto;
    return this.authService.signIn(address, message, signedMessage);
  }
}

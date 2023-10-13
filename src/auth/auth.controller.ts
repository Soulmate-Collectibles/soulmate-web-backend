import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAddressDto } from '../users/dto/user-address.dto';
import { User } from 'src/users/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
    return this.authService.signup(address);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { address, message, signedMessage } = authCredentialsDto;
    return this.authService.signIn(address, message, signedMessage);
  }
}

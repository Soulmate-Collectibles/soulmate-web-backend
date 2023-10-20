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
    return await this.authService.signUp(address);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { address, message, signedMessage } = authCredentialsDto;
    return await this.authService.signIn(address, message, signedMessage);
  }
}

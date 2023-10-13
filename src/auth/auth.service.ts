import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { randomBytes } from 'crypto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    address: string,
    message: string,
    signedMessage: string,
  ): Promise<{ accessToken: string }> {
    const user = this.usersService.getOnePartial(address);
    try {
      const recoveredAddress = ethers.verifyMessage(message, signedMessage);
      if (user && recoveredAddress === address) {
        const payload: JwtPayload = { sub: address };
        const accessToken = await this.jwtService.signAsync(payload);
        return { accessToken };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  signup(address: string): Promise<User> {
    const nonce = this.generateNonce();
    return this.usersService.create(address, nonce);
  }

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }
}

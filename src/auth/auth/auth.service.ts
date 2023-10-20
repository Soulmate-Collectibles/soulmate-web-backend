import {
  BadRequestException,
  Injectable,
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
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.getOnePartial(address);
    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(message, signedMessage);
    } catch (error) {
      throw new BadRequestException('Signed message must be a valid signature');
    }
    if (user && recoveredAddress === address) {
      user.nonce = this.generateNonce();
      await this.usersService.updateNonce(user);
      const payload: JwtPayload = { sub: address };
      return { access_token: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async signUp(address: string): Promise<User> {
    const nonce = this.generateNonce();
    return await this.usersService.create(address, nonce);
  }

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }
}

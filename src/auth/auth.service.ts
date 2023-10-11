import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(address: string): Promise<User> {
    const nonce = this.generateNonce();
    try {
      const user = this.usersRepository.create({ address, nonce });
      await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(user)
        .execute();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Address ${address} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(address: string, message: string, signedMessage: string) {
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.address = :address', { address })
      .getOne();
    const recoveredAddress = ethers.verifyMessage(message, signedMessage);
    if (user && recoveredAddress === address) {
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }
}

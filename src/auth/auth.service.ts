import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(address: string): Promise<void> {
    try {
      await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          address,
          nonce: this.generateNonce(),
        })
        .execute();
      return;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Address already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }
}

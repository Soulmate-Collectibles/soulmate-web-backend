import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { UserAddressDto } from '../users/dto/user-address.dto';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async createUser(userAddressDto: UserAddressDto): Promise<User> {
    const user = this.usersRepository.create({
      ...userAddressDto,
      nonce: this.generateNonce(),
      drops: [],
    });
    return await this.usersRepository.save(user);
  }

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }
}

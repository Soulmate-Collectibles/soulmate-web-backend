import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getFullUserByAddress(address: string): Promise<User> {
    const found = await this.usersRepository.findOne({
      where: {
        address,
      },
      relations: {
        drops: {
          mintlink: true,
        },
      },
    });
    if (!found) {
      throw new NotFoundException(`User with address ${address} not found.`);
    }
    return found;
  }

  async getPartialUserByAddress(address: string): Promise<User> {
    const found = await this.usersRepository.findOneBy({
      address,
    });
    if (!found) {
      throw new NotFoundException(`User with address ${address} not found.`);
    }
    return found;
  }

  async deleteUser(address: string): Promise<void> {
    const { affected: rowsAffected } = await this.usersRepository.delete(
      address,
    );
    if (rowsAffected === 0) {
      throw new NotFoundException(`User with address ${address} not found.`);
    }
  }
}

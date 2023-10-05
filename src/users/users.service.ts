import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getOneByAddress(address: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.drops', 'drop')
      .where('user.address = :address', { address })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with address ${address} not found`);
    }
    return user;
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

  async delete(address: string): Promise<void> {
    const { affected: affectedRows } = await this.usersRepository
      .createQueryBuilder('users')
      .delete()
      .from(User)
      .where('address = :address', { address })
      .execute();
    if (affectedRows === 0) {
      throw new NotFoundException(`User with address ${address} not found`);
    }
    return;
  }
}

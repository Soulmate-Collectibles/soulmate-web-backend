import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getOneFull(address: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.drops', 'drop')
      .leftJoinAndSelect('drop.mintlinks', 'mintlink')
      .where('user.address = :address', { address })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with address ${address} not found`);
    }
    return user;
  }

  async getOnePartial(address: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.address = :address', { address })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with address ${address} not found.`);
    }
    return user;
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

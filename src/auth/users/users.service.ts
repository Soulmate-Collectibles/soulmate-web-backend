import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(address: string, nonce: string): Promise<User> {
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

  async getOnePartial(address: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.address = :address', { address })
      .getOne();
    if (!user) {
      throw new NotFoundException(`User with address ${address} not found.`);
    }
    return user;
  }

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

  async delete(address: string): Promise<void> {
    const { affected: affectedRows } = await this.usersRepository
      .createQueryBuilder()
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

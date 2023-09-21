import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserAddressDto } from './dto/user-address.dto';
import { randomBytes } from 'crypto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Injectable()
export class UsersService {
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

  getUsers(filterDto: GetUsersFilterDto): Promise<User[]> {
    const { search } = filterDto;
    const query = this.usersRepository.createQueryBuilder('user');
    if (search) {
      query.where('user.nonce LIKE :search', {
        search: `%${search}%`,
      });
    }
    try {
      return query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserByAddress(userAddressDto: UserAddressDto): Promise<User> {
    const { address } = userAddressDto;
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

  async deleteUser(userAddressDto: UserAddressDto): Promise<void> {
    const { affected: rowsAffected } = await this.usersRepository.delete(
      userAddressDto,
    );
    if (rowsAffected === 0) {
      throw new NotFoundException(
        `User with address ${userAddressDto.address} not found.`,
      );
    }
  }

  generateNonce(): string {
    return randomBytes(32).toString('hex');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserAddressDto } from './dto/user-address.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getFullUserByAddress(userAddressDto: UserAddressDto): Promise<User> {
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

  async getPartialUserByAddress(userAddress: string): Promise<User> {
    const found = await this.usersRepository.findOneBy({
      address: userAddress,
    });
    if (!found) {
      throw new NotFoundException(
        `User with address ${userAddress} not found.`,
      );
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
}

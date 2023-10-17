import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drop } from './drop.entity';
import { MintlinksService } from '../mintlinks/mintlinks.service';
import { UsersService } from '../auth/users/users.service';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop) private readonly dropsRepository: Repository<Drop>,
    private readonly mintlinksService: MintlinksService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    title: string,
    description: string,
    image: string,
    startDate: Date,
    endDate: Date,
    totalAmount: number,
    creatorAddress: string,
  ): Promise<Drop> {
    const creator = await this.usersService.getOnePartial(creatorAddress);
    const expiryDate = new Date(endDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const mintlink = this.mintlinksService.create(expiryDate, totalAmount);
    const drop = this.dropsRepository.create({
      title,
      description,
      image,
      startDate,
      endDate,
      totalAmount,
      creator,
      mintlinks: [mintlink],
    });
    return await this.dropsRepository.save(drop);
  }

  async getOneFull(dropId: string): Promise<Drop> {
    const drop = await this.dropsRepository
      .createQueryBuilder('drop')
      .leftJoinAndSelect('drop.mintlinks', 'mintlink')
      .where('drop.id = :dropId', { dropId })
      .getOne();
    if (!drop) {
      throw new NotFoundException(`Drop with id ${dropId} not found`);
    }
    return drop;
  }

  async update(
    id: string,
    title: string,
    description: string,
    image: string,
  ): Promise<void> {
    const drop = await this.getOneFull(id);
    if (drop.totalAmount !== drop.mintlinks[0].remainingUses) {
      throw new ConflictException(
        `Cannot update drop with id ${id} because it has already been minted`,
      );
    }
    if (title) {
      drop.title = title;
    }
    if (description) {
      drop.description = description;
    }
    if (image) {
      drop.image = image;
    }
    await this.dropsRepository.save(drop);
    return;
  }

  async delete(id: string): Promise<void> {
    const { affected: affectedRows } = await this.dropsRepository
      .createQueryBuilder()
      .delete()
      .from(Drop)
      .where('id = :id', { id })
      .execute();
    if (affectedRows === 0) {
      throw new NotFoundException(`Drop with id ${id} not found`);
    }
    return;
  }
}

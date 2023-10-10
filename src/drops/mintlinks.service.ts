import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mintlink } from './mintlink.entity';
import { Repository } from 'typeorm';
import { Drop } from './drop.entity';

@Injectable()
export class MintlinksService {
  constructor(
    @InjectRepository(Mintlink)
    private readonly mintlinksRepository: Repository<Mintlink>,
  ) {}

  async create(
    expiresAt: Date,
    remainingUses: number,
    drop: Drop,
  ): Promise<Mintlink> {
    const mintlink = this.mintlinksRepository.create({
      expiresAt,
      remainingUses,
      drop,
    });
    return await this.mintlinksRepository.save(mintlink);
  }

  async getOnePartial(id: string) {
    const mintlink = await this.mintlinksRepository
      .createQueryBuilder()
      .select('mintlink')
      .from(Mintlink, 'mintlink')
      .where('mintlink.id = :id', { id })
      .getOne();
    if (!mintlink) {
      throw new NotFoundException(`Mintlink with id ${id} not found`);
    }
    return mintlink;
  }

  async getOneFull(id: string) {
    const mintlink = await this.mintlinksRepository
      .createQueryBuilder('mintlink')
      .leftJoinAndSelect('mintlink.drop', 'drop')
      .where('mintlink.id = :id', { id })
      .getOne();
    if (!mintlink) {
      throw new NotFoundException(`Mintlink with id ${id} not found`);
    }
    return mintlink;
  }

  async update(id: string, remainingUses: number): Promise<void> {
    const mintlink = await this.getOnePartial(id);
    if (remainingUses >= mintlink.remainingUses) {
      throw new ConflictException(
        `Must decrease number of remaining uses. Current value is ${mintlink.remainingUses}`,
      );
    }
    mintlink.remainingUses = remainingUses;
    await this.mintlinksRepository.save(mintlink);
    return;
  }
}

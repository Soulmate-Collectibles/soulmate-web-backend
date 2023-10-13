import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mintlink } from './mintlink.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MintlinksService {
  constructor(
    @InjectRepository(Mintlink)
    private readonly mintlinksRepository: Repository<Mintlink>,
  ) {}

  create(expiresAt: Date, remainingUses: number): Mintlink {
    return this.mintlinksRepository.create({
      expiresAt,
      remainingUses,
    });
  }

  async getOnePartial(id: string): Promise<Mintlink> {
    const mintlink = await this.mintlinksRepository
      .createQueryBuilder('mintlink')
      .where('mintlink.id = :id', { id })
      .getOne();
    if (!mintlink) {
      throw new NotFoundException(`Mintlink with id ${id} not found`);
    }
    return mintlink;
  }

  async getOneFull(id: string): Promise<Mintlink> {
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

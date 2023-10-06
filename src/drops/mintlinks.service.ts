import { Injectable, NotFoundException } from '@nestjs/common';
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

  async deleteMintlink(id: string): Promise<void> {
    const { affected: rowsAffected } = await this.mintlinksRepository.delete(
      id,
    );
    if (rowsAffected === 0) {
      throw new NotFoundException(`Mintlink with id ${id} not found.`);
    }
  }
}

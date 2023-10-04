import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mintlink } from './mintlink.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MintlinkService {
  constructor(
    @InjectRepository(Mintlink)
    private readonly mintlinksRepository: Repository<Mintlink>,
  ) {}

  async createMintlink(
    expiresAt: Date,
    remainingUses: number,
  ): Promise<Mintlink> {
    const mintlink = {
      expiresAt,
      remainingUses,
    };
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
